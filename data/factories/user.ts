import { request } from "@playwright/test";

const API_URL = "https://api.practicesoftwaretesting.com";
const REGISTER_ENDPOINT = '/users/register';

export async function createUser(email: string, password: string) {
    const context = await request.newContext();
    const response = await context.post(`${API_URL}${REGISTER_ENDPOINT}`, {
        data: {
            first_name: "TestFirstName",
            last_name: "TestLastName",
            dob: "2001-12-25",
            phone: "9991111222",
            email: email,
            password: password,
            address: {
                street: "Test street",
                city: "TestCity",
                state: "TestState",
                country: "US",
                postal_code: "111222"
            }
        }
    })
    return response;
}


