import { Page } from '@playwright/test'

export abstract class AbstractPage {

    protected readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    protected async goto(path: string): Promise<void> {
        await this.page.goto(path)
    }

    protected waitForURL(url: string | RegExp): Promise<void> {
        return this.page.waitForURL(url);
    }
}