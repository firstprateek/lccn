import { test, expect } from "@playwright/test";

test("renders root element", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("lccn-app")).toBeVisible();
});
