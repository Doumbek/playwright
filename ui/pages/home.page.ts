import { Locator, Page } from "@playwright/test";
import { AbstractPage } from "@pages/abstract.page";
import { ProductCardComponent } from "@components/product.card.component";

export class HomePage extends AbstractPage {

    public constructor(page: Page) {
        super(page);
    }

    public async open(): Promise<void> {
        await this.goto(this.getPath())
        await this.waitForURL('**/');
    }

    private getPath(): string {
        return "/";
    }

    public get searchInput(): Locator {
        return this.page.getByTestId("search-query");
    }
    public get searchButton(): Locator {
        return this.page.getByTestId("search-submit");
    }

    public get searchResult(): Locator {
        return this.page.getByTestId("search_completed");
    }

    public get searchResultItems(): Locator {
        return this.searchResult.locator("xpath=//a[@class='card']");
    }

    public async setSearchQuery(query: string): Promise<void> {
        await this.searchInput.fill(query);
    }

    public async clickSearchButton(): Promise<void> {
        await this.searchButton.click();
    }

    // all() resolves immediately — DOM access required, async
    public async getAllProductCards(): Promise<ProductCardComponent[]> {
        const locators = await this.searchResultItems.all();
        return locators.map(root => new ProductCardComponent(root));
    }

    // filter() stays lazy — no DOM access, synchronous
    public getProductCardByTitle(title: string): ProductCardComponent {
        return new ProductCardComponent(
            this.searchResultItems.filter({ hasText: title })
        );
    }
}