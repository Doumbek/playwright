import { BillingAddress } from "@api/types/address.types";

export function buildBillingAddress(overrides?: Partial<BillingAddress>): BillingAddress {
    return {
        street: "Test street",
        city: "Test city",
        state: "CA",
        country: "US",
        postalCode: "111000",
        houseNumber: "123",
        ...overrides
    };
}
