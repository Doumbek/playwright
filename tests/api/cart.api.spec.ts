import { test, expect } from "@playwright/test"

const API_URL = "https://api.practicesoftwaretesting.com";
const LOGIN_ENDPOINT = "/users/login"
const SEARCH_ENDPOINT = "/products/search"
const CARTS_ENDPOINT = "/carts"
const userData = {
    email: "customer@practicesoftwaretesting.com",
    password: "welcome01"
}
const searchQuerry = "Hammer";
const itemTitle = "Thor Hammer";
const qtyToAdd = 1;
const expectedAddToCartMessage = "item added or updated";

const STATUS_OK = 200;
const STATUS_CREATED = 201;


test.describe("Using API call user: ", () => {
    test.skip("should be able to add item to cart", async ({ request }) => {

        // // Login
        // const response = await request.post(`${API_URL}${LOGIN_ENDPOINT}`, {
        //     data: userData
        // })
        // const body = await response.json();

        // expect(response.status()).toBe(STATUS_OK);
        // expect(body.access_token).toBeTruthy();

        // const getProductsByQuerry = async (querry: string) => {
        //     const searchResultResponse = await request.get(`${API_URL}${SEARCH_ENDPOINT}`, {
        //         params: {
        //             q: querry
        //         }
        //     })
        //     return searchResultResponse.status()
        // }

        // expect.poll(async () => await getProductsByQuerry(searchQuerry), {
        //     message: "Check '/product/search' returns value",
        //     intervals: [100, 200, 500],
        //     timeout: 10000
        // }).toBe(STATUS_OK);

        // await expect(async () => {
        //     const searchResultResponse = await request.get(`${API_URL}${SEARCH_ENDPOINT}`);
        //     expect(searchResultResponse.status()).toBe(STATUS_OK);
        // }).toPass();

        // Find products by querry
        const searchResultResponse = await request.get(`${API_URL}${SEARCH_ENDPOINT}`, {
            params: {
                q: searchQuerry
            }
        })
        expect(searchResultResponse.status()).toBe(STATUS_OK);


        // Get specific one by name
        const searchResult: SearchResult = await searchResultResponse.json();
        expect(searchResult.data.length).toBe(7);

        const productItem = getProductItemByName(searchResult, itemTitle);
        expect(productItem.name).toBe(itemTitle);

        // Add item to cart

        // Create cart POST /carts
        const createCartResponse = await request.post(`${API_URL}${CARTS_ENDPOINT}`);
        expect(createCartResponse.status()).toBe(STATUS_CREATED);
        const createdCart: Cart = await createCartResponse.json();

        // Post request to /carts/cart_id with product to add
        const addToCartResponse = await request.post(`${API_URL}${CARTS_ENDPOINT}/${createdCart.id}`, {
            data: {
                product_id: productItem.id,
                quantity: qtyToAdd
            }
        });
        expect(addToCartResponse.status()).toBe(STATUS_OK);
        const addToCartBody = await addToCartResponse.json();
        expect(addToCartBody.result).toBe(expectedAddToCartMessage)

        // Verify product data in cart GET /carts/cart_id
        const getCartResponse = await request.get(`${API_URL}${CARTS_ENDPOINT}/${createdCart.id}`);
        expect(getCartResponse.status()).toBe(STATUS_OK);
        const cart: Cart = await getCartResponse.json();

        expect(cart.id).toBe(createdCart.id);

        const actualCartItem = cart.cart_items.find(item => item.product_id === productItem.id);
        expect(actualCartItem).toBeDefined();
        expect(actualCartItem?.quantity).toBe(1);
        expect(actualCartItem?.product.name).toBe(itemTitle);
    })
});

interface SearchResult {
    data: Array<ProductItem>;
}

interface ProductItem {
    id: string;
    name: string;
}

interface Cart {
    id: string;
    cart_items: Array<CartItem>;
}

interface CartItem {
    product_id: string;
    quantity: number;
    product: ProductItem;
}

function getProductItemByName(searchResult: SearchResult, name: string) {
    const productItem = getProductItem(searchResult, name);
    if (!productItem) {
        throw new Error(`Product item with [${name}] name is not found in response!`)
    }
    return productItem;
}

function getProductItem(searchResult: SearchResult, name: string) {
    return searchResult.data.find(item => item.name === name);
}