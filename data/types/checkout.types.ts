import { RegisterUserData, LoginUserData } from "@api/types/user.types";

export type CreateNewOrderCheckoutTestData = {
    registerUserData: RegisterUserData;
    loginUserData: LoginUserData;
    query: string;
    itemTitle: string;
    expectedAddToCartAlert: string;
    expectedCartQty: string;
    expectedCartTotal: string;
    expectedSignInCheckoutMessage: string;
    billingAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    paymentMethod: string;
    expectedPaymentSuccessAlert: string;
};
