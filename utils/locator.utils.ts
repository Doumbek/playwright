import { Locator } from "@playwright/test";

export async function getItemByTitle(items: Locator[], title: string): Promise<Locator> {
    const searchItem = await searchForItem(items, title)
    if (!searchItem) {
        throw new Error(`Item with [${title}] title is not found!`);
    }
    return searchItem;
}

/**
 * Searches for the first item in the provided array of Locators that matches the given title.
 * 
 * @param items - An array of Locator objects to search through.
 * @param title - The title string to match against each item.
 * @returns A Promise that resolves to the first matching Locator, or undefined if no match is found.
 */
async function searchForItem(items: Locator[], title: string): Promise<Locator | undefined> {
    for (const item of items) {
        if (await isItemHasTitle(item, title)) {
            return item;
        }
    }
}

async function isItemHasTitle(item: Locator, title: string): Promise<boolean> {
    return await item.getByTestId("product-name").innerText() === title;
}
