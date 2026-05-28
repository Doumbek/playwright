import { Locator } from "@playwright/test";

export class ProductCardComponent {

    private readonly root: Locator;

    public constructor(root: Locator) {
        this.root = root;
    }

    public get self(): Locator {
        return this.root;
    }

    public async click(): Promise<void> {
        await this.root.click();
    }

}