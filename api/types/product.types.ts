export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
}

export interface ProductError {
    error: string;
    message: string;
}