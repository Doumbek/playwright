export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface User {
    id: string;
    provider: string | null;
    first_name: string;
    last_name: string;
    dob: string;
    phone: string | null;
    email: string;
    totp_enabled: boolean;
    created_at: string;
    address: {
        street: string;
        house_number: string | null;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    }
}

export interface RegisterUserData {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    password: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
}

export interface LoginUserData {
    email: string;
    password: string;
}
