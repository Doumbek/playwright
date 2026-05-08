import { Locator, Page } from "@playwright/test";

export class ProductPage {

    readonly url: string = "/product/{product_id}"
    readonly page: Page;
    readonly addToCartButton: Locator;
    readonly alert: Locator;
    readonly cartQty: Locator;
    readonly cart: Locator;



    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator("xpath=//button[@id='btn-add-to-cart']");
        this.alert = page.getByRole("alert");
        this.cartQty = page.getByTestId("cart-quantity");
        this.cart = page.getByTestId("nav-cart");
    }

    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }

    async clickCartIcon() {
        await this.cart.click();
    }
}