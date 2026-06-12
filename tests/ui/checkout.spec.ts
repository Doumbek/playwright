import { test, request, Page } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { AccountPage } from "@pages/account.page";
import { HomePage } from "@pages/home.page";
import { ProductPage } from "@pages/product.page";
import { CheckoutPage } from "@pages/checkout.page";
import { ApiActions } from "@steps/actions/api.actions";
import { NavigationSection } from "@sections/navigation.section";
import { AlertSection } from "@sections/alert.section";
import { ApiClient } from "@api/api.client";
import { envConfig } from "@utils/config.utils";
import { getCreateNewOrderCheckoutDataSet as getCreateNewOrderDataSet } from "@data-providers/checkout.provider";
import { CreateNewOrderCheckoutTestData as CreateNewOrderTestData } from "@data-types/checkout.types";
import { LoginActions } from "@steps/actions/login.actions";
import { AccountActions } from "@steps/actions/account.actions";
import { HomeActions } from "@steps/actions/home.actions";
import { ProductActions } from "@steps/actions/product.actions";
import { CheckoutActions } from "@steps/actions/checkout.actions";
import { NavigationActions } from "@steps/actions/navigation.actions";
import { HomeVerifications } from "@steps/verifications/home.verifications";
import { AlertVerifications } from "@steps/verifications/alert.verifications";
import { NavigationVerifications } from "@steps/verifications/navigation.verifications";
import { CheckoutVerifications } from "@steps/verifications/checkout.verifications";

let client: ApiClient;
let apiActions: ApiActions;

let loginActions: LoginActions;
let accountActions: AccountActions;
let homeActions: HomeActions;
let productActions: ProductActions;
let checkoutActions: CheckoutActions;
let navigationActions: NavigationActions;

let homePageVerifications: HomeVerifications;
let alertVerifications: AlertVerifications;
let navigationVerifications: NavigationVerifications;
let checkoutVerifications: CheckoutVerifications;

let basicPage: Page;

test.beforeAll("Setup data", async ({ browser }) => {

    basicPage = await browser.newPage();

    client = new ApiClient({
        context: await request.newContext({
            baseURL: envConfig.apiUrl
        })
    });
    apiActions = new ApiActions(client);
    loginActions = new LoginActions(new LoginPage(basicPage));
    accountActions = new AccountActions(new AccountPage(basicPage));
    homeActions = new HomeActions(new HomePage(basicPage));
    productActions = new ProductActions(new ProductPage(basicPage));
    checkoutActions = new CheckoutActions(new CheckoutPage(basicPage));
    navigationActions = new NavigationActions(new NavigationSection(basicPage));

    homePageVerifications = new HomeVerifications(new HomePage(basicPage));
    alertVerifications = new AlertVerifications(new AlertSection(basicPage));
    navigationVerifications = new NavigationVerifications(new NavigationSection(basicPage));
    checkoutVerifications = new CheckoutVerifications(new CheckoutPage(basicPage));


})

test.describe("During checkout:", () => {
    getCreateNewOrderDataSet().forEach((dataSet: CreateNewOrderTestData) => {
        test("0001. Registered user should be able to create new order", async () => {

            await apiActions.registerUser(dataSet.registerUserData);

            await loginActions.navigateToLoginPage();
            await loginActions.login(dataSet.loginUserData);
            await accountActions.waitUntilAccountPageIsOpened();

            await homeActions.navigateToHomePage();
            await homeActions.searchForProductWithTile(dataSet.query);

            await homePageVerifications.verifySearchResultIsShown();
            await homePageVerifications.verifyProductCardWithTitleIsShown(dataSet.itemTitle);

            await homeActions.clickProductWithTitle(dataSet.itemTitle);
            await productActions.addCurrentProductToCart();

            await alertVerifications.verifyAlertHasCorrectMessage(dataSet.expectedAddToCartAlert);
            await navigationVerifications.verifyCartHasCorrectQuantityValue(dataSet.expectedCartQty);

            await navigationActions.clickCartIcon();
            await checkoutActions.waitUntilPageIsOpened();

            await checkoutVerifications.verifyCartTotalHasCorrectValue(dataSet.expectedCartTotal);
            await checkoutActions.proceedToCheckoutFromCart();

            await checkoutVerifications.verifySignInMessageHasCorrectValue(dataSet.expectedSignInCheckoutMessage);
            await checkoutActions.proceedToCheckoutFromSignIn();

            await checkoutVerifications.verifyBillingAddressFormIsVisible();
            await checkoutActions.setBillingAddressAndProceedToCheckout(dataSet.billingAddress);

            await checkoutVerifications.verifyPaymentMethodSelectorIsVisible();
            await checkoutActions.setPaymentMethodAndConfirm(dataSet.paymentMethod);

            await checkoutVerifications.verifyPaymentSuccessMessageHasCorrectValue(dataSet.expectedPaymentSuccessMessage);

            // Confirm order on UI
            // Verify invoices
            // Confirm in the backend (API call or DB check)

        });
    });
});
