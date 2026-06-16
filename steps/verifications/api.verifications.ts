import { AddToCartResponse, CartItem } from "@api/types/carts.types";
import { Product, ProductsSearchResult } from "@api/types/product.types";
import test, { expect } from "@playwright/test";

export class ApiVerifications {

    public async verifyProductSearchResultHasCorrectProductListSize(result: ProductsSearchResult, expectedSize: number): Promise<void> {
        await test.step(`ApiVerifications: Verify product search result has correct product list size - [${expectedSize}]`, () => {
            expect(result.data.length).toBe(expectedSize);
            expect(result.total).toBe(expectedSize);
        });
    }

    public async verifyProductHasCorrectName(product: Product, expectedName: string): Promise<void> {
        await test.step(`ApiVerifications: Verify product has correct name - [${expectedName}]`, () => {
            expect(product.name).toBe(expectedName);
        });
    }

    public async verifyAddToCartResponseHasCorrectMessage(response: AddToCartResponse, expectedMessage: string): Promise<void> {
        await test.step(`ApiVerifications: Verify add to cart response has correct message - [${expectedMessage}]`, () => {
            expect(response.result).toBe(expectedMessage);
        });
    }

    public async verifyCartHasCorrectId(cartId: string, expectedCartId: string): Promise<void> {
        await test.step(`ApiVerifications: Verify cart has correct id - [${expectedCartId}]`, () => {
            expect(cartId).toBe(expectedCartId);
        });
    }

    public async verifyCartItemHasCorrectProductName(cartItem: CartItem, expectedProductName: string): Promise<void> {
        await test.step(`ApiVerifications: Verify cart item has correct product name - [${expectedProductName}]`, () => {
            expect(cartItem.product.name).toBe(expectedProductName);
        });
    }

    public async verifyCartItemHasCorrectQuantity(cartItem: CartItem, expectedQuantity: number): Promise<void> {
        await test.step(`ApiVerifications: Verify cart item has correct quantity - [${expectedQuantity}]`, () => {
            expect(cartItem.quantity).toBe(expectedQuantity);
        });
    }
}