import { NavigationSection } from "@sections/navigation.section";
import test, { expect } from "@playwright/test";

export class NavigationVerifications {

    private readonly navigationSection: NavigationSection;

    public constructor(navigationSection: NavigationSection) {
        this.navigationSection = navigationSection;
    }

    public async verifyCartHasCorrectQuantityValue(expectedQty: string): Promise<void> {
        await test.step(`NavigationVerifications: Verify 'Cart' icon has correct quantity value -> [${expectedQty}]`, async () => {
            await expect(this.navigationSection.cartQty).toHaveText(expectedQty);
        });
    }
}
