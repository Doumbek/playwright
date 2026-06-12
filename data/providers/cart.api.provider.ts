import { AddProductToCartTestData } from "@data-types/cart.api.types";

export function getAddProductToCartDataSet(): AddProductToCartTestData[] {
    return [
        {
            searchQuery: "Hammer",
            productTitle: "Thor Hammer",
            quantity: 1,
            expectedAddToCartMessage: "item added or updated",
            expectedProductListSize: 6,
        },
    ];
}
