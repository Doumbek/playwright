import { ProductPage } from "@pages/product.page";
import test from "@playwright/test";

export class ProductActions {

    private readonly productPage: ProductPage;

    public constructor(productPage: ProductPage) {
        this.productPage = productPage;
    }

    public async addCurrentProductToCart(): Promise<void> {
        await test.step("ProductActions: Add current product to cart", async () => {
            await this.productPage.clickAddToCartButton();
        });
    }
}
