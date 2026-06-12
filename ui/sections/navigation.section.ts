import { Locator, Page } from "@playwright/test";

export class NavigationSection {

    private readonly root: Locator;

    public constructor(page: Page) {
        this.root = page.locator("xpath=//nav");
    }

    public get cartQty(): Locator {
        return this.root.getByTestId("cart-quantity");
    }

    public get cart(): Locator {
        return this.root.getByTestId("nav-cart");
    }

    public async clickCartIcon(): Promise<void> {
        await this.cart.click();
    }
}