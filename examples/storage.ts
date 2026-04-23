import test from "@playwright/test";

const userSessionFile = ".auth/user_01.json";

test.describe("Home page with signed in user", () => {
    test.use({ storageState: userSessionFile });
    test("should not have visible 'Sign in' button", async ({ page }) => {

    });
})