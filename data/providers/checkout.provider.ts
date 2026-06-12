import { generateRandomEmailWithPrefix } from "@utils/data.utils";
import { buildRegisterUserData } from "@data-builders/user.builder";
import { buildBillingAddress } from "@data-builders/address.builder";
import { CreateNewOrderCheckoutTestData } from "@data-types/checkout.types";

export function getCreateNewOrderCheckoutDataSet(): CreateNewOrderCheckoutTestData[] {
    const userData = buildRegisterUserData({
        email: generateRandomEmailWithPrefix("user000101"),
    });

    return [
        {
            registerUserData: userData,
            loginUserData: {
                email: userData.email,
                password: userData.password,
            },
            query: "Hammer",
            itemTitle: "Thor Hammer",
            expectedAddToCartAlert: "Product added to shopping cart.",
            expectedCartQty: "1",
            expectedCartTotal: "$11.14",
            expectedSignInCheckoutMessage: `Hello ${userData.first_name} ${userData.last_name}, you are already logged in. You can proceed to checkout.`,
            billingAddress: buildBillingAddress({
                postalCode: "000101",
            }),
            paymentMethod: "cash-on-delivery",
            expectedPaymentSuccessMessage: "Payment was successful",
        },
    ]
};