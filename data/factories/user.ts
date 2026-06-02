import { ApiClient } from "@api/api.client";
import { RegisterUserData } from "@api/types/user.types";

export async function createUser(client: ApiClient, userData: RegisterUserData): Promise<void> {
    return client.registerUser(userData);
}


