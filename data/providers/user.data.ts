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
    }
}

export interface LoginUserData {
    email: string;
    password: string;
}