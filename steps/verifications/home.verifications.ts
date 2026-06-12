import { HomePage } from "@pages/home.page";
import test, { expect } from "@playwright/test";

export class HomeVerifications {

    private readonly homePage: HomePage;

    public constructor(homePage: HomePage) {
        this.homePage = homePage;
    }

    public async verifySearchResultIsShown(): Promise<void> {
        await test.step(`HomeVerifications: Verify search result is shown`, async () => {
            await expect(this.homePage.searchResult).toBeVisible();
        });
    }

    public async verifyProductCardWithTitleIsShown(title: string): Promise<void> {
        await test.step(`HomeVerifications: Verify product card with title is shown -> [${title}]`, async () => {
            await expect(this.homePage.getProductCardByTitle(title).self).toBeVisible();
        });
    }
}