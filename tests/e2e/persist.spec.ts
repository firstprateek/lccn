import { test, expect } from "@playwright/test";

test("add cell persists across reload", async ({ page }) => {
  await page.goto("/");
  const cells = page.locator('[data-testid="cell"]');
  const before = await cells.count();

  await page.getByTestId("add-cell").click();
  await expect(cells).toHaveCount(before + 1);

  await page.reload();
  await expect(cells).toHaveCount(before + 1);
});
