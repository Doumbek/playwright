import { RegisterUserData } from "@api/types/user.types";
import {generateRandomEmailWithPrefix } from "@utils/data.utils";

export function buildRegisterUserData(overrides?: Partial<RegisterUserData>): RegisterUserData {
    return{
        first_name: "TestFirstName",
        last_name: "TestLastName",
        dob: "2001-12-25",
        phone: "9991111222",
        email: generateRandomEmailWithPrefix("defaultUser"),
        password: "checkoutBasicUser1@",
        address: {
            city: "TestCity",
            country: "US",
            postal_code: "111222",
            state: "TestState",
            street: "Test street"
        },
        ...overrides
    }
}