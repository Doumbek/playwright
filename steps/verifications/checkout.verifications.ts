import { CheckoutPage } from "@pages/checkout.page";
import test, { expect } from "@playwright/test";

export class CheckoutVerifications {

    private readonly checkoutPage: CheckoutPage;

    public constructor(checkoutPage: CheckoutPage) {
        this.checkoutPage = checkoutPage;
    }

    public async verifyCartTotalHasCorrectValue(expectedTotal: string): Promise<void> {
        await test.step(`CheckoutVerifications: Verify cart total has correct value -> [${expectedTotal}]`, async () => {
            await expect(this.checkoutPage.getCheckoutCartComponent().cartTotal).toHaveText(expectedTotal);
        })
    }

    public async verifySignInMessageHasCorrectValue(expectedMessage: string): Promise<void> {
        await test.step(`CheckoutVerifications: Verify sign-in message has correct value -> [${expectedMessage}]`, async () => {
            await expect(this.checkoutPage.getCheckoutSignInComponent().signInMessage).toHaveText(expectedMessage);
        })
    }

    public async verifyBillingAddressFormIsVisible(): Promise<void> {
        await test.step(`CheckoutVerifications: Verify billing address form is visible`, async () => {
            await expect(this.checkoutPage.getCheckoutAddressComponent().self).toBeVisible();
        })
    }

    public async verifyPaymentMethodSelectorIsVisible(): Promise<void> {
        await test.step(`CheckoutVerifications: Verify payment method selector is visible`, async () => {
            await expect(this.checkoutPage.getCheckoutPaymentComponent().paymentMethod).toBeVisible();
        })
    }

    public async verifyPaymentSuccessMessageHasCorrectValue(expectedMessage: string): Promise<void> {
        await test.step(`CheckoutVerifications: Verify payment success message has correct value -> [${expectedMessage}]`, async () => {
            await expect(this.checkoutPage.getCheckoutPaymentComponent().successMessage).toHaveText(expectedMessage);
        })
    }
}
