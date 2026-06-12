import { ApiClient } from "@api/api.client";
import { AddToCartData, AddToCartResponse, Cart, CartItem } from "@api/types/carts.types";

import { Product, ProductsSearchResult } from "@api/types/product.types";
import { RegisterUserData } from "@api/types/user.types";
import test from "@playwright/test";

export class ApiActions {

    private readonly client: ApiClient;

    public constructor(client: ApiClient) {
        this.client = client;
    }

    public async registerUser(userData: RegisterUserData): Promise<void> {
        await test.step(`ApiActions: Register new user with data -> [${JSON.stringify(userData)}]`, async () => {
            await this.client.registerUser(userData);
        })
    }

    public async searchProductsByQuery(searchQuery: string): Promise<ProductsSearchResult> {
        return await test.step(`ApiActions: Search products by query -> [${searchQuery}]`, async () => {
            return this.client.searchProducts(searchQuery);
        })
    }

    public async getProductByNameFromProductSearchResult(searchQuery: string, name: string): Promise<Product> {
        return await test.step(`ApiActions: Get product by name -> [${name}] from search result by query -> [${searchQuery}]`, async () => {
            const productItem = await this.searchAndGetProduct(searchQuery, name);
            return this.checkProduct(productItem, name);
        })
    }

    public async createNewCart(): Promise<Cart> {
        return await test.step(`ApiActions: Create new cart`, async () => {
            return this.client.createCart();
        })
    }

    public async addProductToCart(cartId: string, data: AddToCartData): Promise<AddToCartResponse> {
        return await test.step(`ApiActions: Add [${data.quantity}] product [${data.product_id}] to cart [${cartId}]`, async () => {
            return this.client.addProductToCart(cartId, data);
        })
    }

    public async getCartById(cartId: string): Promise<Cart> {
        return await test.step(`ApiActions: Get cart by id -> [${cartId}]`, async () => {
            return this.client.getCartById(cartId);
        })
    }

    public async getCartItemForProduct(cartId: string, productId: string): Promise<CartItem> {
        return await test.step(`ApiActions: Get cart item for product -> id: [${productId}] from cart with id -> [${cartId}]`, async () => {
            const cart = await this.getCartById(cartId);
            const cartItem = cart.cart_items.find(item => item.product_id === productId)
            return this.checkCartItem(cartItem, productId);
        })
    }

    private async searchAndGetProduct(searchQuery: string, name: string): Promise<Product | undefined> {
        return (await this.searchProductsByQuery(searchQuery))
            .data.find(item => item.name === name);
    }

    //TODO: move to separate verifications class and use in tests instead of throwing errors in case of not found item, add more checks for product and cart item details
    private checkProduct(productItem: Product | undefined, name: string): Product {
        if (!productItem) {
            throw new Error(`Product with [${name}] name is not found in product search result`);
        }
        return productItem;
    }

    private checkCartItem(cartItem: CartItem | undefined, productId: string): CartItem {
        if (!cartItem) {
            throw new Error(`Cart item for product with id: [${productId}] is not found in cart`);
        }
        return cartItem;
    }
}
