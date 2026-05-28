import { AbstractPage } from "@pages/abstract.page";
import { Page } from "@playwright/test";

export class AccountPage extends AbstractPage {

    public constructor(page: Page) {
        super(page);
    }

    public async waitUntilOpened(): Promise<void> {
        await this.waitForURL("**/account");
    }
}