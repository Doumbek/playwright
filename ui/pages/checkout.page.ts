import { Locator, Page } from "@playwright/test";

export class CheckoutPage {

    readonly url: string = "/checkout"
    readonly page: Page;
    readonly cartTotal: Locator;
    readonly proceedToSignInButton: Locator;
    readonly proceedToBillingAddressButton: Locator;
    readonly proceedToPaymentButton: Locator;
    readonly signInMessage: Locator;
    readonly billingAddressStreet: Locator;
    readonly billingAddressCity: Locator;
    readonly billingAddressState: Locator;
    readonly billingAddressCountry: Locator;
    readonly billingAddressPostalCode: Locator;
    readonly paymentMethod: Locator;
    readonly paymentConfirmButton: Locator;
    readonly paymentSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartTotal = page.getByTestId("cart-total");
        this.proceedToSignInButton = page.getByTestId("proceed-1");
        this.proceedToBillingAddressButton = page.getByTestId("proceed-2");
        this.proceedToPaymentButton = page.getByTestId("proceed-3");
        this.signInMessage = page.locator("xpath=//app-login//p");
        this.billingAddressStreet = page.getByTestId("street");
        this.billingAddressCity = page.getByTestId("city");
        this.billingAddressState = page.getByTestId("state");
        this.billingAddressCountry = page.getByTestId("country");
        this.billingAddressPostalCode = page.getByTestId("postal_code");
        this.billingAddressPostalCode = page.getByTestId("postal_code");
        this.paymentMethod = page.getByTestId("payment-method");
        this.paymentConfirmButton = page.getByTestId("finish");
        this.paymentSuccessMessage = page.getByTestId("payment-success-message");
    }

    async clickProcceedSignInButton() {
        await this.proceedToSignInButton.click();
    }

    async clickProceedToBillingAddress() {
        await this.proceedToBillingAddressButton.click();
    }

    async clickProceedToPaymentButton() {
        await this.proceedToPaymentButton.click();
    }

    async setBillingAddressStreet(street: string) {
        await this.billingAddressStreet.fill(street);
    }

    async setBillingAddressCity(city: string) {
        await this.billingAddressCity.fill(city);
    }

    async setBillingAddressState(state: string) {
        await this.billingAddressState.fill(state);
    }

    async setBillingAddressCountry(country: string) {
        await this.billingAddressCountry.fill(country);
    }

    async setBillingAddressPostalCode(postalCode: string) {
        await this.billingAddressPostalCode.fill(postalCode);
    }

    async setPaymentMethod(paymentMethod: string) {
        await this.paymentMethod.selectOption(paymentMethod);
    }

    async clickPaymentConfirmButton() {
        await this.paymentConfirmButton.click();
    }
}