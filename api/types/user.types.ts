export interface User {
    id: string;
    provider: string;
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    totp_enabled: boolean;
    created_at: string;
    address: {
        street: string;
        house_number: string;
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
