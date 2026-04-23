import { Browser, BrowserContext, chromium, expect, Locator, Page } from "@playwright/test";

const browser: Browser = await chromium.launch();
const context: BrowserContext = await browser.newContext()
const page: Page = await context.newPage()
const signInButton: Locator = page.getByRole("button", { name: 'Sign in' });

/** Locator Assertion */
/** Is element visible */
await expect(signInButton).toBeVisible();

/** Is element has text */
await expect(signInButton).toContainText("Sign in");

/** Is page has URL */
await expect(page).toHaveURL("Test URL here");


/** Value Assertion */
/** Is element has text */
expect(signInButton.textContent()).toContain("Sign in")

/** Is element visible */
expect(signInButton.isVisible()).toBeTruthy()