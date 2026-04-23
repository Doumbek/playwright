import { Browser, BrowserContext, chromium, Page } from "@playwright/test";

const browser: Browser = await chromium.launch();
const context: BrowserContext = await browser.newContext()
const page: Page = await context.newPage()

/** getByRole - interact */
page.getByRole("button", { name: 'Sign in' });
await page.getByRole("button", { name: 'Sign in' }).click();

/** getByText - get text from page*/
page.getByText('Jane Doe');
await page.getByText('Jane Doe').innerText();

/** getByLabel - to fill data*/
page.getByLabel('username');
await page.getByLabel('username').fill("Jane");
await page.getByLabel('username').pressSequentially("Jane");

/** getByPlaceholder */

/** getByAltText */

/** getByTitle */

/** getByTestId get by specific test id attribute, for instance: [data-test="nav-sign-in"]*/
page.getByTestId('nav-sign-in');
await page.getByTestId('nav-sign-in').click();

/** Custom locator (CSS, Xpath) */
page.locator('css=button');
page.locator('xpath=//button');
await page.locator('button:has-text("Log in"), button:has-text("Sign in")').click();