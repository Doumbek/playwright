import { generateRandomEmailWithPrefix } from "@utils/data.utils";
import { buildRegisterUserData } from "@data-builders/user.builder";
import { buildBillingAddress } from "@data-builders/address.builder";
import { CreateNewOrderCheckoutTestData } from "@data-types/checkout.types";

export function getCreateNewOrderUILoginDataSet(): CreateNewOrderCheckoutTestData[] {
    const user000101 = buildRegisterUserData({
        email: generateRandomEmailWithPrefix("user000101"),
    });

    return [
        {
            registerUserData: user000101,
            loginUserData: {
                email: user000101.email,
                password: user000101.password,
            },
            query: "Hammer",
            itemTitle: "Thor Hammer",
            expectedAddToCartAlert: "Product added to shopping cart.",
            expectedCartQty: "1",
            expectedCartTotal: "$11.14",
            expectedSignInCheckoutMessage: `Hello ${user000101.first_name} ${user000101.last_name}, you are already logged in. You can proceed to checkout.`,
            billingAddress: buildBillingAddress({
                postalCode: "000101",
            }),
            paymentMethod: "cash-on-delivery",
            expectedPaymentSuccessMessage: "Payment was successful",
        },
    ]
};

export function getCreateNewOrdeSessionStorageDataSet(): CreateNewOrderCheckoutTestData[] {
    const user000201 = buildRegisterUserData({
        email: generateRandomEmailWithPrefix("user000201"),
    });

    return [
        {
            registerUserData: user000201,
            loginUserData: {
                email: user000201.email,
                password: user000201.password,
            },
            query: "Hammer",
            itemTitle: "Thor Hammer",
            expectedAddToCartAlert: "Product added to shopping cart.",
            expectedCartQty: "1",
            expectedCartTotal: "$11.14",
            expectedSignInCheckoutMessage: `Hello ${user000201.first_name} ${user000201.last_name}, you are already logged in. You can proceed to checkout.`,
            billingAddress: buildBillingAddress({
                postalCode: "000101",
            }),
            paymentMethod: "cash-on-delivery",
            expectedPaymentSuccessMessage: "Payment was successful",
        },
    ]
};