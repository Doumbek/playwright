import { Locator } from "@playwright/test";

export class CheckoutCartComponent {

    private readonly root: Locator;

    public constructor(root: Locator) {
        this.root = root;
    }

    public get self(): Locator {
        return this.root;
    }

    public get cartTotal(): Locator {
        return this.root.getByTestId("cart-total");
    }

    public get proceedToCheckoutButton(): Locator {
        return this.root.getByTestId("proceed-1");
    }

    public async clickProceedToCheckoutButton(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }
}