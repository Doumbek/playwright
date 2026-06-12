import { RegisterUserData, LoginUserData } from "@api/types/user.types";
import { BillingAddress } from "@api/types/address.types";

export type CreateNewOrderCheckoutTestData = {
    registerUserData: RegisterUserData;
    loginUserData: LoginUserData;
    query: string;
    itemTitle: string;
    expectedAddToCartAlert: string;
    expectedCartQty: string;
    expectedCartTotal: string;
    expectedSignInCheckoutMessage: string;
    billingAddress: BillingAddress;
    paymentMethod: string;
    expectedPaymentSuccessMessage: string;
};
