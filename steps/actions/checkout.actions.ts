import { CheckoutPage } from "@pages/checkout.page";
import { BillingAddress } from "@api/types/address.types";
import test from "@playwright/test";

export class CheckoutActions {

    private readonly checkoutPage: CheckoutPage;

    public constructor(checkoutPage: CheckoutPage) {
        this.checkoutPage = checkoutPage;
    }

    // TODO: try to refactor using TypeScript decorators for steps, e.g. @step("description") before method declaration, to avoid boilerplate
    public async waitUntilPageIsOpened(): Promise<void> {
        await test.step("CheckoutActions: Wait until checkout page is opened", async () => {
            await this.checkoutPage.waitUntilOpened();
        });
    }

    public async proceedToCheckoutFromCart(): Promise<void> {
        await test.step("CheckoutActions: Proceed to checkout from cart", async () => {
            const cartComponent = this.checkoutPage.getCheckoutCartComponent();
            await cartComponent.clickProceedToCheckoutButton();
        });
    }

    public async proceedToCheckoutFromSignIn(): Promise<void> {
        await test.step("CheckoutActions: Proceed to checkout from sign-in", async () => {
            const signInComponent = this.checkoutPage.getCheckoutSignInComponent();
            await signInComponent.clickProceedToCheckoutButton();
        });
    }

    //TODO: BillingAddress do we need all data all the time? Now we have all set by default. In case we do not need somethig we should set NULL or EMPTY when need reset data?
    public async setBillingAddressAndProceedToCheckout(address: BillingAddress): Promise<void> {
        await test.step(`CheckoutActions: Set billing address and proceed -> [${JSON.stringify(address)}]`, async () => {
            const addressComponent = this.checkoutPage.getCheckoutAddressComponent();
            await addressComponent.setCountry(address.country);
            await addressComponent.setPostalCode(address.postalCode);
            await addressComponent.setHouseNumber(address.houseNumber);
            await addressComponent.setStreet(address.street);
            await addressComponent.setCity(address.city);
            await addressComponent.setState(address.state);
            await addressComponent.clickProceedToCheckoutButton();
        });
    }

    public async setPaymentMethodAndConfirm(paymentMethod: string): Promise<void> {
        await test.step(`CheckoutActions: Set payment method and confirm -> [${paymentMethod}]`, async () => {
            const paymentComponent = this.checkoutPage.getCheckoutPaymentComponent();
            await paymentComponent.setPaymentMethod(paymentMethod);
            await paymentComponent.clickConfirmButton();
        });
    }
}
