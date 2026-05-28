import { Locator, Page } from "@playwright/test";

export class AlertSection {

  private readonly root: Locator;

  public constructor(page: Page) {
    this.root = page.locator("xpath=//div[@class='overlay-container']");
  }

  public get alert(): Locator {
    return this.root.getByRole("alert");
  }
}