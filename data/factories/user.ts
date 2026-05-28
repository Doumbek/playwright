import { ApiClient } from "@api/api.client";
import { User } from "@api/types/user.types";
import { APIResponse, request } from "@playwright/test";
import { envConfig } from "@utils/config.utils";

const API_URL = envConfig.apiUrl;
const REGISTER_ENDPOINT = '/users/register';


export async function createUserV2(email: string, password: string): Promise<void> {
    const client = new ApiClient({
        context: await request.newContext({
            baseURL: envConfig.apiUrl
        })
    });

    return client.registerUser({
            first_name: "TestFirstName",
            last_name: "TestLastName",
            dob: "2001-12-25",
            phone: "9991111222",
            email: email,
            password: password,
            address: {
                city: "TestCity",
                country: "US",
                postal_code: "111222",
                state: "TestState",
                street: "Test street"
            }
        })
}

export async function createUser(email: string, password: string) {
    const context = await request.newContext();
    const response: APIResponse = await context.post(`${API_URL}${REGISTER_ENDPOINT}`, {
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
    return response.json();
}


