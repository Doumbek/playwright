import { ApiClient } from "@api/api.client";
import { Cart } from "@api/types/carts.types";
import { Product, ProductsSearchResult } from "@api/types/product.types";
import { test, request } from "@playwright/test"
import { ApiActions } from "@steps/actions/api.actions";
import { ApiVerifications } from "@steps/verifications/api.verifications";
import { envConfig } from "@utils/config.utils";

const searchQuerry = "Hammer";
const productTitle = "Thor Hammer";
const qtyToAdd = 1;
const expectedAddToCartMessage = "item added or updated";
const expectedProductListSize = 6;

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
    test("unathorized user should be able to add product to cart", async () => {

        // Find products by querry
        const productsSearchResult: ProductsSearchResult = await apiActions.searchProductsByQuery(searchQuerry);
        apiVerifications.verifyProductSearchResultHasCorrectProductListSize(productsSearchResult, expectedProductListSize);

        //Verify Product has correct name
        const product: Product = await apiActions.getProductByNameFromProductSearchResult(searchQuerry, productTitle); ``
        apiVerifications.verifyProductHasCorrectName(product, productTitle);

        // Add product to cart and verify response message
        const createdCart: Cart = await apiActions.createNewCart();
        const addToCartResponse = await apiActions.addProductToCart(createdCart.id, {
            product_id: product.id,
            quantity: qtyToAdd
        });
        apiVerifications.verifyAddToCartResponseHasCorrectMessage(addToCartResponse, expectedAddToCartMessage)

        //Verify cart and cart items details
        const cart: Cart = await apiActions.getCartById(createdCart.id);
        apiVerifications.verifyCartHasCorrectId(cart.id, createdCart.id);
        const actualCartItem = await apiActions.getCartItemForProduct(createdCart.id, product.id);
        apiVerifications.verifyCartItemHasCorrectQuantity(actualCartItem, qtyToAdd);
        apiVerifications.verifyCartItemHasCorrectProductName(actualCartItem, productTitle);
    })
});
