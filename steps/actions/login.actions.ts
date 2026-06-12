import { LoginUserData } from "@api/types/user.types";
import { LoginPage } from "@pages/login.page";
import test from "@playwright/test";

export class LoginActions {

    private readonly loginPage: LoginPage;

    public constructor(loginPage: LoginPage) {
        this.loginPage = loginPage
    }

    public async navigateToLoginPage(): Promise<void> {
        await test.step("LoginActions: Navigate to login page", async () => {
            await this.loginPage.open();
        });
    }

    public async login(loginData: LoginUserData): Promise<void> {
        await test.step(`LoginActions: login using next user data -> [${JSON.stringify(loginData)}]`, async () => {
            await this.loginPage.setEmail(loginData.email);
            await this.loginPage.setPassword(loginData.password);
            await this.loginPage.clickSubmitButton();
        });
    }

}