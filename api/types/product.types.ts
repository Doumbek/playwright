export interface ProductsSearchResult {
    current_page: number;
    data: Array<Product>;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    is_location_offer: boolean;
    is_rental: boolean;
    co2_rating: string;
    in_stock: boolean;
    is_eco_friendly: boolean;
    product_image: ProductImage;
    category: ProductCategory;
    brand: Brand;
}

export interface ProductImage {
    id: string;
    by_name: string;
    by_url: string;
    source_name: string;
    source_url: string;
    file_name: string;
    title: string;
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface Brand {
    id: string;
    name: string;
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
