import { HomePage } from "@pages/home.page";
import test from "@playwright/test";

export class HomeActions {

    private readonly homePage: HomePage;

    public constructor(homePage: HomePage) {
        this.homePage = homePage;
    }

    public async navigateToHomePage(): Promise<void> {
        await test.step("HomeActions: Navigate to home page", async () => {
            await this.homePage.open();
        })
    }

    public async searchForProductWithTile(title: string): Promise<void> {
        await test.step(`HomeActions: Search for product with title [${title}]`, async () => {
            await this.homePage.setSearchQuery(title);
            await this.homePage.clickSearchButton();
        })
    }

    public async clickProductWithTitle(title: string): Promise<void> {
        await test.step(`HomeActions: Click by product item with [${title}] title`, async () => {
            await this.homePage.getProductCardByTitle(title).click();
        })
    }
}
