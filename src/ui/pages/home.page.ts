import { Locator, Page } from "@playwright/test";

export class HomePage {

    readonly url: string = "/"
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchResultComponent: Locator;
    readonly searchResultItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder("Search");
        this.searchButton = page.getByTestId("search-submit");
        this.searchResultComponent = page.getByTestId("search_completed");
        this.searchResultItems = this.searchResultComponent.locator("xpath=//a[@class='card']");
    }

    async open() {
        await this.page.goto(this.url);
    }

    async setSearchQuery(query: string) {
        await this.searchInput.fill(query);
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    getItemByTitle(title: string) {
        return this.searchResultItems.filter({ hasText: title })
    }

    async clickItem(title: string) {
        await this.getItemByTitle(title).click()
    }
}