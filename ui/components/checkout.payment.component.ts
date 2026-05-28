import {Locator} from "@playwright/test";

export class CheckoutPaymentComponent {

    private readonly root: Locator;

    public constructor(root: Locator) {
        this.root = root;
    }

    public get self(): Locator {
        return this.root;
    }

    public get paymentMethod(): Locator {
        return this.root.getByTestId("payment-method");
    }

    public get confirmButton(): Locator {
        return this.root.getByTestId("finish");
    }

    public get successMessage(): Locator {
        return this.root.getByTestId("payment-success-message");
    }

    public async setPaymentMethod(paymentMethod: string): Promise<void> {
        await this.paymentMethod.selectOption(paymentMethod);
    }

    public async clickConfirmButton(): Promise<void> {
        await this.confirmButton.click();
    }
}