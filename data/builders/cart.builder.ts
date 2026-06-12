import { AddToCartData } from "@api/types/carts.types";

export function prepareAddToCartData(productId: string, quantity: number): AddToCartData {
    return {
        product_id: productId,
        quantity: quantity,
    };
}
