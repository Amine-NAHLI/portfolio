import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/lr-desktop-config.js";
import { launch } from "chrome-launcher";

const port = 3200;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = ["/fr", "/en", "/fr/projects", "/fr/contact"];
const outputDirectory = resolve(".lighthouseci");
const nextCli = resolve("node_modules/next/dist/bin/next");
const profilePath = resolve(outputDirectory, `chrome-${process.pid}`);

await mkdir(outputDirectory, { recursive: true });
const server = spawn(process.execPath, [nextCli, "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
let chrome;
let exitCode = 0;

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

try {
  await waitForServer();
  await mkdir(profilePath, { recursive: true });
  chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
    userDataDir: profilePath,
    logLevel: "silent",
  });
  for (const route of routes) await auditRoute(route);
  process.stdout.write("Lighthouse thresholds passed for every audited route.\n");
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  await chrome?.kill();
  await rm(profilePath, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }).catch(() => undefined);
  await stopServer();
}

process.exit(exitCode);

async function auditRoute(route) {
  const name = route.replace(/^\//, "").replaceAll("/", "-");
  const outputPath = resolve(outputDirectory, `${name}.json`);
  if (!chrome) throw new Error("Chrome did not start");
  const runnerResult = await lighthouse(`${baseUrl}${route}`, { port: chrome.port, logLevel: "silent", output: "json" }, desktopConfig);
  if (!runnerResult) throw new Error(`Lighthouse did not produce a report for ${route}`);
  const report = runnerResult.lhr;
  await writeFile(outputPath, JSON.stringify(report), "utf8");
  const scores = Object.fromEntries(
    ["performance", "accessibility", "best-practices", "seo"].map((category) => [
      category,
      Math.round((report.categories[category]?.score ?? 0) * 100),
    ]),
  );
  const metrics = {
    lcp: report.audits["largest-contentful-paint"]?.numericValue ?? Number.POSITIVE_INFINITY,
    cls: report.audits["cumulative-layout-shift"]?.numericValue ?? Number.POSITIVE_INFINITY,
    tbt: report.audits["total-blocking-time"]?.numericValue ?? Number.POSITIVE_INFINITY,
  };
  const failures = [];
  if (scores.performance < 90) failures.push(`performance ${scores.performance} < 90`);
  if (scores.accessibility < 95) failures.push(`accessibility ${scores.accessibility} < 95`);
  if (scores["best-practices"] < 95) failures.push(`best-practices ${scores["best-practices"]} < 95`);
  if (scores.seo < 95) failures.push(`seo ${scores.seo} < 95`);
  if (metrics.lcp > 2500) failures.push(`LCP ${Math.round(metrics.lcp)} ms > 2500 ms`);
  if (metrics.cls > 0.1) failures.push(`CLS ${metrics.cls.toFixed(3)} > 0.1`);
  if (metrics.tbt > 200) failures.push(`TBT ${Math.round(metrics.tbt)} ms > 200 ms`);

  process.stdout.write(`${route}: ${JSON.stringify({ scores, metrics })}\n`);
  if (failures.length) throw new Error(`${route}: ${failures.join(", ")}`);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js exited with code ${server.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
  throw new Error(`Next.js did not become ready at ${baseUrl}`);
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolvePromise) => server.once("exit", resolvePromise)),
    new Promise((resolvePromise) => setTimeout(resolvePromise, 3_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}
