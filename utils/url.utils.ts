import { Page } from "@playwright/test";

const pageUrlRegexp = "^(https?://)?([\\w.]+)([/\\w]+)";
const EMPTY_STRING = ''

export function getPageNode(page: Page): string {
    const matches = page.url().match(pageUrlRegexp);
    return matches !== null ? matches[3] : EMPTY_STRING;
}