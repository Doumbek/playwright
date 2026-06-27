import { Page } from "@playwright/test"

export class SessionSetup {

    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page
    }

    public async setAuthToken(token: string): Promise<void> {
        await this.page.goto("/");
        await this.page.localStorage.setItem('auth-token', token);
    }
}