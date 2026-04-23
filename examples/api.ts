import { expect, test } from "@playwright/test";

const API_URL = "https://api.practicesoftwaretesting.com";

test("GET /products", async ({ request }) => {
    const response = await request.get(API_URL + "/products");
    const body = await response.json()

    expect(response.status()).toBe(200);
    expect(body.data.length).toBe(50);
})

test("POST /user/login", async ({ request }) => {
    const response = await request.post(API_URL + "/user/login", {
        data: {
            email: "email@here",
            password: "passwordHere"
        }
    })

    expect(response.status()).toBe(200);
})