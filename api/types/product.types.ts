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

export interface ProductData {
    title: string;
    description: string;
    price: number;
    discount_percentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
}
