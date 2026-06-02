import { generateRandomEmailWithPrefix } from "@utils/data.utils";
import { buildRegisterUserData } from "@data-builders/user.builder";
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
            billingAddress: {
                street: "Test street 1",
                city: "Test city",
                state: "CA",
                country: "USA",
                postalCode: "111000",
            },
            paymentMethod: "cash-on-delivery",
            expectedPaymentSuccessAlert: "Payment was successful",
        },
    ]
};