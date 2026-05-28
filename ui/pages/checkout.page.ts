import { CheckoutAddressComponent } from "@components/checkout.address.component";
import { CheckoutCartComponent } from "@components/checkout.cart.component";
import { CheckoutPaymentComponent } from "@components/checkout.payment.component";
import { CheckoutSignInComponent } from "@components/checkout.signin.component";
import { AbstractPage } from "@pages/abstract.page";
import { Page } from "@playwright/test";

export class CheckoutPage extends AbstractPage {

    public constructor(page: Page) {
        super(page);
    }

    public async waitUntilOpened(): Promise<void> {
        await this.waitForURL("**/checkout");
    }

    public getCheckoutCartComponent(): CheckoutCartComponent {
        return new CheckoutCartComponent(this.page.locator("xpath=//app-cart"));
    }

    public getCheckoutSignInComponent(): CheckoutSignInComponent {
        return new CheckoutSignInComponent(this.page.locator("xpath=//app-login"));
    }

    public getCheckoutAddressComponent(): CheckoutAddressComponent {
        return new CheckoutAddressComponent(this.page.locator("xpath=//app-address"));
    }

    public getCheckoutPaymentComponent(): CheckoutPaymentComponent {
        return new CheckoutPaymentComponent(this.page.locator("xpath=//app-payment"));
    }
}