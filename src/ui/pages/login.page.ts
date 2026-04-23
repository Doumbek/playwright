import { Locator, Page } from "@playwright/test";

export class LoginPage {

    readonly url: string = "/auth/login"
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder("Your email");
        this.passwordInput = page.getByPlaceholder("Your password");
        this.submitButton = page.getByTestId("login-submit");
    }

    async open() {
        await this.page.goto(this.url);
    }

    async setEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async setPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickSubmitButton() {
        await this.submitButton.click();
    }

}

