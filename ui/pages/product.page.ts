import { Locator, Page } from "@playwright/test";
import { AbstractPage } from "@pages/abstract.page";

export class ProductPage extends AbstractPage {

    public constructor(page: Page) {
        super(page);
    }

    public async open(productId: string): Promise<void> {
        await this.goto(this.getPath(productId))
        await this.waitForURL(`**/product/${productId}`);
    }

    private getPath(productId: string): string {
        return `/product/${productId}`;
    }

    public get addToCartButton(): Locator {
        return this.page.locator("xpath=//button[@id='btn-add-to-cart']");
    }

    public async clickAddToCartButton(): Promise<void> {
        await this.addToCartButton.click();
    }
}
