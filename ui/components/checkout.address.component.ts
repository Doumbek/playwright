import { Locator } from "@playwright/test";

export class CheckoutAddressComponent {

    private readonly root: Locator;

    public constructor(root: Locator) {
        this.root = root;
    }

    public get self(): Locator {
        return this.root;
    }

    public get country(): Locator {
        return this.root.getByTestId("country");
    }

    public get postalCode(): Locator {
        return this.root.getByTestId("postal_code");
    }

    public get houseNumber(): Locator {
        return this.root.getByTestId("house_number");
    }


    public get street(): Locator {
        return this.root.getByTestId("street");
    }

    public get city(): Locator {
        return this.root.getByTestId("city");
    }

    public get state(): Locator {
        return this.root.getByTestId("state");
    }

    public get proceedToCheckoutButton(): Locator {
        return this.root.getByTestId("proceed-3");
    }

    public async setCountry(country: string): Promise<void> {
        await this.country.selectOption(country);
    }

    public async setPostalCode(postalCode: string): Promise<void> {
        await this.postalCode.fill(postalCode);
    }

    public async setHouseNumber(houseNumber: string): Promise<void> {
        await this.houseNumber.fill(houseNumber);
    }

    public async setStreet(street: string): Promise<void> {
        await this.street.fill(street);
    }

    public async setCity(city: string): Promise<void> {
        await this.city.fill(city);
    }

    public async setState(state: string): Promise<void> {
        await this.state.fill(state);
    }

    public async clickProceedToCheckoutButton(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }
}