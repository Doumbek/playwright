import { ApiClient } from "@api/api.client";
import { Cart } from "@api/types/carts.types";
import { Product, ProductsSearchResult } from "@api/types/product.types";
import { test, request } from "@playwright/test"
import { ApiActions } from "@steps/actions/api.actions";
import { ApiVerifications } from "@steps/verifications/api.verifications";
import { envConfig } from "@utils/config.utils";
import { getAddProductToCartDataSet } from "@data-providers/cart.api.provider";
import { AddProductToCartTestData } from "@data-types/cart.api.types";
import { prepareAddToCartData } from "@data-builders/cart.builder";

let client: ApiClient;
let apiActions: ApiActions;
let apiVerifications: ApiVerifications;

test.beforeAll("Setup data", async () => {
    client = new ApiClient({
        context: await request.newContext({
            baseURL: envConfig.apiUrl
        })
    });
    apiActions = new ApiActions(client);
    apiVerifications = new ApiVerifications();
})

test.describe("Using API call: ", () => {
    getAddProductToCartDataSet().forEach((dataSet: AddProductToCartTestData) => {
        test("unathorized user should be able to add product to cart", async () => {

            // Find products by query
            const productsSearchResult: ProductsSearchResult = await apiActions.searchProductsByQuery(dataSet.searchQuery);
            apiVerifications.verifyProductSearchResultHasCorrectProductListSize(productsSearchResult, dataSet.expectedProductListSize);

            // Verify Product has correct name
            const product: Product = await apiActions.getProductByNameFromProductSearchResult(dataSet.searchQuery, dataSet.productTitle);
            apiVerifications.verifyProductHasCorrectName(product, dataSet.productTitle);

            // Add product to cart and verify response message
            const createdCart: Cart = await apiActions.createNewCart();
            const addToCartResponse = await apiActions.addProductToCart(createdCart.id, prepareAddToCartData(product.id, dataSet.quantity));
            apiVerifications.verifyAddToCartResponseHasCorrectMessage(addToCartResponse, dataSet.expectedAddToCartMessage)

            // Verify cart and cart items details
            const cart: Cart = await apiActions.getCartById(createdCart.id);
            apiVerifications.verifyCartHasCorrectId(cart.id, createdCart.id);
            const actualCartItem = await apiActions.getCartItemForProduct(createdCart.id, product.id);
            apiVerifications.verifyCartItemHasCorrectQuantity(actualCartItem, dataSet.quantity);
            apiVerifications.verifyCartItemHasCorrectProductName(actualCartItem, dataSet.productTitle);
        });
    });
});
