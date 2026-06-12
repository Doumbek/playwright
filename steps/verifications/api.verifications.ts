import { AddToCartResponse, CartItem } from "@api/types/carts.types";
import { Product, ProductsSearchResult } from "@api/types/product.types";
import test, { expect } from "@playwright/test";

export class ApiVerifications {

    public verifyProductSearchResultHasCorrectProductListSize(result: ProductsSearchResult, expectedSize: number): void {
        test.step(`ApiVerifications: Verify product search result has correct product list size - [${expectedSize}]`, () => {
            expect(result.data.length).toBe(expectedSize);
            expect(result.total).toBe(expectedSize);
        });
    }

    public verifyProductHasCorrectName(product: Product, expectedName: string): void {
        test.step(`ApiVerifications: Verify product has correct name - [${expectedName}]`, () => {
            expect(product.name).toBe(expectedName);
        });
    }

    public verifyAddToCartResponseHasCorrectMessage(response: AddToCartResponse, expectedMessage: string): void {
        test.step(`ApiVerifications: Verify add to cart response has correct message - [${expectedMessage}]`, () => {
            expect(response.result).toBe(expectedMessage);
        });
    }

    public verifyCartHasCorrectId(cartId: string, expectedCartId: string): void {
        test.step(`ApiVerifications: Verify cart has correct id - [${expectedCartId}]`, () => {
            expect(cartId).toBe(expectedCartId);
        });
    }

    public verifyCartItemHasCorrectProductName(cartItem: CartItem, expectedProductName: string): void {
        test.step(`ApiVerifications: Verify cart item has correct product name - [${expectedProductName}]`, () => {
            expect(cartItem.product.name).toBe(expectedProductName);
        });
    }

    public verifyCartItemHasCorrectQuantity(cartItem: CartItem, expectedQuantity: number): void {
        test.step(`ApiVerifications: Verify cart item has correct quantity - [${expectedQuantity}]`, () => {
            expect(cartItem.quantity).toBe(expectedQuantity);
        });
    }
}