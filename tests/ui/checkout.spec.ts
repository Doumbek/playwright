import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { AccountPage } from "@pages/account.page";
import { HomePage } from "@pages/home.page";
import { ProductPage } from "@pages/product.page";
import { CheckoutPage } from "@pages/checkout.page";
import { createUser } from "@data-factories/user";
import { NavigationSection } from "@sections/navigation.section";
import { AlertSection } from "@sections/alert.section";
import { CheckoutCartComponent } from "@components/checkout.cart.component";
import { CheckoutPaymentComponent } from "@components/checkout.payment.component";
import { CheckoutAddressComponent } from "@components/checkout.address.component";
import { CheckoutSignInComponent } from "@components/checkout.signin.component";

const userEmail = `test${Date.now()}@test.com`;
const userPassword = "testTEST1@";
const userName = "TestFirstName TestLastName";

const query = "Hammer";
const itemTitle = "Thor Hammer";
const expectedAddToCartAlert = "Product added to shopping cart.";
const expectedCartQty = "1";
const expectedCartTotal = "$11.14"
const expectedSignInCheckoutMessage = `Hello ${userName}, you are already logged in. You can proceed to checkout.`
const billingAddress = {
    street: "Test street 1",
    city: "Test city",
    state: "CA",
    country: "USA",
    postalCode: "111000",
}
const paymentMethod = "cash-on-delivery";
const expectedPaymentSuccessAlerrt = "Payment was successful";
test.beforeAll("Setup data", async () => {
    await createUser(userEmail, userPassword)
})

test.describe("During checkout user:", () => {
    test("should be able to create new order", async ({ page }) => {

        const loginPage: LoginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.setEmail(userEmail);
        await loginPage.clickSubmitButton();

        const accountPage: AccountPage = new AccountPage(page);
        await accountPage.waitUntilOpened();

        const homePage: HomePage = new HomePage(page);
        await homePage.open();
        await homePage.setSearchQuery(query);
        await homePage.clickSearchButton();
        await expect(homePage.searchResult).toBeVisible();
        await expect(homePage.getProductCardByTitle(itemTitle).self).toBeVisible();

        await homePage.getProductCardByTitle(itemTitle).click();

        const productPage: ProductPage = new ProductPage(page);
        await productPage.clickAddToCartButton();

        const navigationSection: NavigationSection = new NavigationSection(page);
        const alertSection: AlertSection = new AlertSection(page);
        await expect(alertSection.alert).toHaveText(expectedAddToCartAlert);
        await expect(navigationSection.cartQty).toHaveText(expectedCartQty);

        await navigationSection.clickCartIcon();

        const checkoutPage: CheckoutPage = new CheckoutPage(page);
        await checkoutPage.waitUntilOpened();

        const checkoutCartComponent: CheckoutCartComponent = checkoutPage.getCheckoutCartComponent();
        await expect(checkoutCartComponent.cartTotal).toHaveText(expectedCartTotal)
        await checkoutCartComponent.clickProceedToCheckoutButton();

        const checkoutSignInComponent: CheckoutSignInComponent = checkoutPage.getCheckoutSignInComponent();
        await expect(checkoutSignInComponent.signInMessage).toHaveText(expectedSignInCheckoutMessage);
        await checkoutSignInComponent.clickProceedToCheckoutButton();

        const checkoutAddressComponent: CheckoutAddressComponent = checkoutPage.getCheckoutAddressComponent();
        await expect(checkoutAddressComponent.self).toBeVisible();
        await checkoutAddressComponent.setCountry(billingAddress.country);
        await checkoutAddressComponent.setPostalCode(billingAddress.postalCode);
        await checkoutAddressComponent.setStreet(billingAddress.street);
        await checkoutAddressComponent.setCity(billingAddress.city);
        await checkoutAddressComponent.setState(billingAddress.state);
        await checkoutAddressComponent.clickProceedToCheckoutButton();

        const checkoutPaymentComponent: CheckoutPaymentComponent = checkoutPage.getCheckoutPaymentComponent();
        await expect(checkoutPaymentComponent.paymentMethod).toBeVisible();
        await checkoutPaymentComponent.setPaymentMethod(paymentMethod);
        await checkoutPaymentComponent.clickConfirmButton();

        await expect(checkoutPaymentComponent.successMessage).toHaveText(expectedPaymentSuccessAlerrt);

        // Confirm order on UI
        // Verify invoices
        // Confirm in the backend (API call or DB check)

    })
})
