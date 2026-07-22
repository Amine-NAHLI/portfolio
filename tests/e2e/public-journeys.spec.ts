import { expect, test } from "@playwright/test";

test("serves both locales and remembers the selected language", async ({ page, context }) => {
  await page.goto("/fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Afficher la version anglaise" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  const localeCookie = (await context.cookies()).find((cookie) => cookie.name === "portfolio-locale");
  expect(localeCookie?.value).toBe("en");
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("supports the principal public journey", async ({ page }) => {
  await page.goto("/fr");
  await page.getByRole("link", { name: /projets/i }).first().click();
  await expect(page).toHaveURL(/\/fr\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/fr/search");
  const search = page.getByRole("searchbox");
  await expect(search).toBeVisible();
  await search.fill("React");
  await expect(page.locator("main")).toContainText("1 résultat");

  await page.goto("/fr/contact");
  await expect(page.getByRole("heading", { name: "Envoyer un message" })).toBeVisible();
  await page.getByLabel("Nom").fill("Test de validation");
  await page.getByLabel("Adresse e-mail").fill("adresse-invalide");
  await page.getByLabel("Objet").fill("Validation du formulaire");
  await page.getByLabel("Message", { exact: true }).fill("Ce message sert uniquement à vérifier la validation native du formulaire.");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByLabel("Adresse e-mail")).toBeFocused();
});

test("protects the administration entry point", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile navigation is keyboard operable and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/fr");

  const menuButton = page.getByRole("button", { name: "Ouvrir le menu" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Navigation principale" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation principale" })).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test("skip link exposes the main content target", async ({ page }) => {
  await page.goto("/fr");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Aller au contenu principal" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeVisible();
});

for (const width of [320, 375, 425, 768, 1024, 1440, 1920]) {
  test(`has no horizontal page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/fr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
}

test("respects the reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr");
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).not.toBe("smooth");
});
