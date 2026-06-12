import { AccountPage } from "@pages/account.page";
import test from "@playwright/test";

export class AccountActions {

    private readonly accountPage: AccountPage;

    public constructor(accountPage: AccountPage) {
        this.accountPage = accountPage;
    }

    public async waitUntilAccountPageIsOpened(): Promise<void> {
        await test.step("AccountActions: Wait until account page is opened", async () => {
            await this.accountPage.waitUntilOpened();
        });
    }
}