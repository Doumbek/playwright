import { AbstractPage } from "@pages/abstract.page";
import { Locator, Page } from "@playwright/test";


export class LoginPage extends AbstractPage {

    public constructor(page: Page) {
        super(page);
    }

    public async open(): Promise<void> {
        await this.goto(this.getPath())
        await this.waitForURL('**/auth/login');
    }

    private getPath(): string {
        return "/auth/login";
    }

    public get emailInput(): Locator {
        return this.page.getByPlaceholder("Your email");
    }

    public get passwordInput(): Locator {
        return this.page.getByPlaceholder("Your password");
    }

    public get submitButton(): Locator {
        return this.page.getByTestId("login-submit");
    }

    public async setEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    public async setPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    public async clickSubmitButton(): Promise<void> {
        await this.submitButton.click();
    }
}
