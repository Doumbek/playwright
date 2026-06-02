import { APIRequestContext, APIResponse } from "@playwright/test";
import { Product, ProductData } from "@api-types/product.types";
import { User, LoginUserData, RegisterUserData } from "@api-types/user.types";
import { endpoints } from "@api/endpoints";
import { HttpStatus } from "@api/http.status";

export interface ClientOptions {
    context: APIRequestContext;
}

export class ApiClient {

    private readonly context: APIRequestContext;

    public constructor(options: ClientOptions) {
        this.context = options.context;
    }

    public async getProducts(): Promise<Product[]> {
        return this.getProductsAs<Product[]>(HttpStatus.OK);
    }

    public async getProductsAs<T>(expectedStatus: HttpStatus): Promise<T> {
        const response = await this.get(endpoints.products);
        this.checkResponseStatus(response, expectedStatus);
        return this.parseAs<T>(response);
    }

    public async getProductById(id: number): Promise<Product> {
        return this.getProductByIdAs<Product>(id, HttpStatus.OK);
    }

    public async getProductByIdAs<T>(id: number, expectedStatus: HttpStatus): Promise<T> {
        const response = await this.get(`${endpoints.products}/${id}`);
        this.checkResponseStatus(response, expectedStatus);
        return this.parseAs<T>(response);
    }

    public async createProduct(body: ProductData): Promise<Product> {
        return this.createProductAs<Product>(body, HttpStatus.CREATED);
    }

    public async createProductAs<T>(body: unknown, expectedStatus: HttpStatus): Promise<T> {
        const response = await this.post(endpoints.products, body);
        this.checkResponseStatus(response, expectedStatus);
        return this.parseAs<T>(response);
    }

    public async registerUser(body: RegisterUserData): Promise<void> {
        await this.registerUserAs(body, HttpStatus.CREATED);
    }

    public async registerUserAs(body: unknown, expectedStatus: HttpStatus): Promise<void> {
        const response = await this.post(endpoints.register, body);
        this.checkResponseStatus(response, expectedStatus);
    }

    public async loginUser(body: LoginUserData): Promise<void> {
        await this.loginUserAs(body, HttpStatus.OK);
    }

    public async loginUserAs(body: unknown, expectedStatus: HttpStatus): Promise<void> {
        const response = await this.post(endpoints.login, body);
        this.checkResponseStatus(response, expectedStatus);
    }

    public async getCurrentUser(): Promise<User> {
        return this.getCurrentUserAs<User>(HttpStatus.OK);
    }

    public async getCurrentUserAs<T>(expectedStatus: HttpStatus): Promise<T> {
        const response = await this.get(endpoints.me);
        this.checkResponseStatus(response, expectedStatus);
        return this.parseAs<T>(response);
    }

    private async get(path: string): Promise<APIResponse> {
        return this.context.get(path);
    }

    private async post(path: string, body: unknown): Promise<APIResponse> {
        return this.context.post(path, { data: body });
    }

    private async put(path: string, body: unknown): Promise<APIResponse> {
        return this.context.put(path, { data: body });
    }

    private async delete(path: string): Promise<APIResponse> {
        return this.context.delete(path);
    }

    // Might use ZOD schemas here for better type safety and validation
    private async parseAs<T>(response: APIResponse): Promise<T> {
        return (await response.json()) as T;
    }

    private checkResponseStatus(response: APIResponse, expectedStatus: HttpStatus): void {
        if (response.status() !== expectedStatus) {
            throw new Error(`Expected status should be [${expectedStatus}]. Received [${response.status()}].\n URL: [${response.url()}]`);
        }
    }
}