import { Page } from "@playwright/test";

export class AccountPage {

    readonly url: string = "/account"
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitUntilOpened() {
        await this.page.waitForURL(url => url.pathname.endsWith(this.url));
    }
}