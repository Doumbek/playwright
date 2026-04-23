import { test, expect } from "@playwright/test"

test("should have correct screenshot state", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("file_name_here");
    await expect(page).toHaveScreenshot("file_name_here", { mask: [page.getByTitle("")] });
})