import test from "@playwright/test";
import { NavigationSection } from "@sections/navigation.section";

export class NavigationActions {

    private readonly navigationSection: NavigationSection;

    public constructor(navigationSection: NavigationSection) {
        this.navigationSection = navigationSection;
    }

    public async clickCartIcon(): Promise<void> {
        await test.step("NavigationActions: click 'Cart' icon", async () => {
            await this.navigationSection.clickCartIcon();
        })
    }
}
