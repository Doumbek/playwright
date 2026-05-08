import { test, expect} from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { AccountPage } from "@pages/account.page";
import { HomePage } from "@pages/home.page";
import { ProductPage } from "@pages/product.page";
import { CheckoutPage } from "@pages/checkout.page";
import { createUser } from "@data-factories/user";

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
        await expect(homePage.searchResultComponent).toBeVisible();
        await expect(homePage.getItemByTitle(itemTitle)).toBeVisible();

        await homePage.clickItem(itemTitle);

        const productPage: ProductPage = new ProductPage(page);
        await productPage.clickAddToCartButton();
        await expect(productPage.alert).toHaveText(expectedAddToCartAlert);
        await expect(productPage.cartQty).toHaveText(expectedCartQty);

        await productPage.clickCartIcon();

        const checkoutPage: CheckoutPage = new CheckoutPage(page);
        await expect(checkoutPage.cartTotal).toHaveText(expectedCartTotal)

        await checkoutPage.clickProcceedSignInButton();
        await expect(checkoutPage.signInMessage).toHaveText(expectedSignInCheckoutMessage);

        await checkoutPage.clickProceedToBillingAddress();
        await expect(checkoutPage.proceedToPaymentButton).toBeVisible();

        await checkoutPage.setBillingAddressStreet(billingAddress.street);
        await checkoutPage.setBillingAddressCity(billingAddress.city);
        await checkoutPage.setBillingAddressState(billingAddress.state);
        await checkoutPage.setBillingAddressCountry(billingAddress.country);
        await checkoutPage.setBillingAddressPostalCode(billingAddress.postalCode);
        await checkoutPage.clickProceedToPaymentButton();
        await expect(checkoutPage.paymentMethod).toBeVisible();

        await checkoutPage.setPaymentMethod(paymentMethod);
        await checkoutPage.clickPaymentConfirmButton();

        await expect(checkoutPage.paymentSuccessMessage).toHaveText(expectedPaymentSuccessAlerrt);

        // Verify invoices

    })
})
