import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";

const port = 3100;
const baseUrl = `http://127.0.0.1:${port}`;
const nextCli = resolve("node_modules/next/dist/bin/next");
const playwrightCli = resolve("node_modules/@playwright/test/cli.js");
const server = spawn(process.execPath, [nextCli, "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  windowsHide: true,
});

let exitCode = 1;
try {
  await waitForServer();
  exitCode = await run(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
    ...process.env,
    PLAYWRIGHT_MANAGED_SERVER: "1",
  });
} finally {
  await stopServer();
}

process.exitCode = exitCode;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js exited with code ${server.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // The optimized server is still starting.
    }
    await delay(500);
  }
  throw new Error(`Next.js did not become ready at ${baseUrl}`);
}

function run(command, args, env) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: process.cwd(), env, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code) => resolvePromise(code ?? 1));
  });
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), delay(3_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

function delay(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}
