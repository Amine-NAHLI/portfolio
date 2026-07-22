import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/fr", "/en", "/fr/projects", "/fr/contact", "/fr/search", "/admin/login"]) {
  test(`${path} has no automated WCAG 2.2 AA violation`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
