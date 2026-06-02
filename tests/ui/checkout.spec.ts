import { test, expect, request } from "@playwright/test";
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
import { ApiClient } from "@api/api.client";
import { envConfig } from "@utils/config.utils";
import { getCreateNewOrderCheckoutDataSet as getCreateNewOrderDataSet } from "@data-providers/checkout.provider";
import { CreateNewOrderCheckoutTestData as CreateNewOrderTestData } from "@data-types/checkout.types";

let client: ApiClient;

test.beforeAll("Setup data", async () => {
    client = new ApiClient({
        context: await request.newContext({
            baseURL: envConfig.apiUrl
        })
    });
})

test.describe("During checkout user:", () => {
    getCreateNewOrderDataSet().forEach((dataSet: CreateNewOrderTestData) => {
        test("0001. should be able to create new order", async ({ page }) => {

            await createUser(client, dataSet.registerUserData);

            const loginPage: LoginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.setEmail(dataSet.loginUserData.email);
            await loginPage.setPassword(dataSet.loginUserData.password);
            await loginPage.clickSubmitButton();

            const accountPage: AccountPage = new AccountPage(page);
            await accountPage.waitUntilOpened();

            const homePage: HomePage = new HomePage(page);
            await homePage.open();
            await homePage.setSearchQuery(dataSet.query);
            await homePage.clickSearchButton();
            await expect(homePage.searchResult).toBeVisible();
            await expect(homePage.getProductCardByTitle(dataSet.itemTitle).self).toBeVisible();

            await homePage.getProductCardByTitle(dataSet.itemTitle).click();

            const productPage: ProductPage = new ProductPage(page);
            await productPage.clickAddToCartButton();

            const navigationSection: NavigationSection = new NavigationSection(page);
            const alertSection: AlertSection = new AlertSection(page);
            await expect(alertSection.alert).toHaveText(dataSet.expectedAddToCartAlert);
            await expect(navigationSection.cartQty).toHaveText(dataSet.expectedCartQty);

            await navigationSection.clickCartIcon();

            const checkoutPage: CheckoutPage = new CheckoutPage(page);
            await checkoutPage.waitUntilOpened();

            const checkoutCartComponent: CheckoutCartComponent = checkoutPage.getCheckoutCartComponent();
            await expect(checkoutCartComponent.cartTotal).toHaveText(dataSet.expectedCartTotal);
            await checkoutCartComponent.clickProceedToCheckoutButton();

            const checkoutSignInComponent: CheckoutSignInComponent = checkoutPage.getCheckoutSignInComponent();
            await expect(checkoutSignInComponent.signInMessage).toHaveText(dataSet.expectedSignInCheckoutMessage);
            await checkoutSignInComponent.clickProceedToCheckoutButton();

            const checkoutAddressComponent: CheckoutAddressComponent = checkoutPage.getCheckoutAddressComponent();
            await expect(checkoutAddressComponent.self).toBeVisible();
            await checkoutAddressComponent.setCountry(dataSet.billingAddress.country);
            await checkoutAddressComponent.setPostalCode(dataSet.billingAddress.postalCode);
            await checkoutAddressComponent.setStreet(dataSet.billingAddress.street);
            await checkoutAddressComponent.setCity(dataSet.billingAddress.city);
            await checkoutAddressComponent.setState(dataSet.billingAddress.state);
            await checkoutAddressComponent.clickProceedToCheckoutButton();

            const checkoutPaymentComponent: CheckoutPaymentComponent = checkoutPage.getCheckoutPaymentComponent();
            await expect(checkoutPaymentComponent.paymentMethod).toBeVisible();
            await checkoutPaymentComponent.setPaymentMethod(dataSet.paymentMethod);
            await checkoutPaymentComponent.clickConfirmButton();

            await expect(checkoutPaymentComponent.successMessage).toHaveText(dataSet.expectedPaymentSuccessAlert);

            // Confirm order on UI
            // Verify invoices
            // Confirm in the backend (API call or DB check)

        });
    });
});
