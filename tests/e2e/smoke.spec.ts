import { expect, test } from "@playwright/test";

test("gallery to exhibition smoke flow", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible();

  await page.locator('a[href^="/photo/"]').first().click();
  await expect(page.getByRole("link", { name: "View Construction" })).toBeVisible();

  await page.getByRole("link", { name: "View Construction" }).click();
  await expect(page.getByText("Construction Timeline")).toBeVisible();

  await page.goto("/exhibition");
  await expect(page.getByRole("link", { name: "Exit" })).toBeVisible();
});
