import { AlertSection } from "@sections/alert.section";
import test, { expect } from "@playwright/test";

export class AlertVerifications {

    private readonly alertSection: AlertSection;

    public constructor(alertSection: AlertSection) {
        this.alertSection = alertSection;
    }

    public async verifyAlertHasCorrectMessage(expectedMessage: string): Promise<void> {
        await test.step(`AlertVerifications: Verify alert has correct message -> [${expectedMessage}]`, async () => {
            await expect(this.alertSection.alert).toHaveText(expectedMessage);
        })
    }
}
