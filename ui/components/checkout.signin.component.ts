import { Locator } from "@playwright/test";

export class CheckoutSignInComponent {

    private readonly root: Locator;
    
    public constructor(root: Locator) {
        this.root = root;
    }   

    public get self(): Locator {
        return this.root;
    }
    
    public get signInMessage(): Locator {
        return this.root.locator("xpath=.//p");
    }

    public get proceedToCheckoutButton(): Locator {
        return this.root.getByTestId("proceed-2");
    }

    public async clickProceedToCheckoutButton(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }
}