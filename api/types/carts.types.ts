export interface Cart {
    id: string;
    additional_discount_percentage: number | null;
    lat: number | null;
    lng: number | null;
    cart_items: Array<CartItem>;
}

export interface CartItem {
    id: string;
    quantity: number;
    discount_percentage: number | null;
    cart_id: string;
    product_id: string;
    product: CartProduct;
}

export interface CartProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    is_location_offer: boolean;
    is_rental: boolean;
    co2_rating: string;
    in_stock: boolean;
    is_eco_friendly: boolean;
}

export interface AddToCartData {
    product_id: string;
    quantity: number;
}

export interface AddToCartResponse {
    result: string;
}
