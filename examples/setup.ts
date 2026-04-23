import { test as setup } from "@playwright/test"

const userSessionFile = ".auth/user_01.json";

setup("Setup session for user_01", async ({ page, context }) => {
    //Login to setup session in browser
    //Save browser session state in file as JSON object
    await context.storageState({ path: userSessionFile });
})