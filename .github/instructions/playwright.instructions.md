---
applyTo: "**/*.spec.ts,**/pages/**,**/sections/**,**/components/**,**/steps/**,**/fixtures/**"
---

# Playwright-Specific Instructions

These rules apply to all Playwright-related files: tests, pages, sections,
components, steps, and fixtures.

---

## Page Object Rules

### Structure — every Page class must follow this pattern
```typescript
import { Page, Locator } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class ExamplePage extends AbstractPage {

  // 1. Constructor takes Page as param
  constructor(page: Page) {
    super(page);
  }

  // 2. Private locator getters — never exposed outside class
  private get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  private get emailInput(): Locator {
    return this.page.getByLabel('Email');
  }

  // 3. Public async methods — behaviour, not elements
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }
}
```

**Rules:**
- Locators defined as private getters — never inline inside methods
- All locator properties are `private getters`
- All action methods are `async` with explicit return types
- No assertions inside Page classes — assertions belong in Verifications

---

## Section Rules

> A Section is like a Page without a URL — independent, takes `Page` in constructor,
> owns its locator root, usable from any context.
> Sections do NOT extend AbstractPage — they are not part of the Page hierarchy.

```typescript
import { Page, Locator } from '@playwright/test';

export class NavigationSection {

  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('navigation');
  }

  private get homeLink(): Locator {
    return this.root.getByRole('link', { name: 'Home' });
  }

  private get searchInput(): Locator {
    return this.root.getByRole('searchbox');
  }

  async navigateHome(): Promise<void> {
    await this.homeLink.click();
  }
}
```

**Rules:**
- Takes `Page` directly in constructor — independent of any specific Page class
- Does NOT extend AbstractPage — independent concept, not part of Page hierarchy
- Owns its locator root
- No Actions logic inside Section — atomic methods only

---

## Component Rules

```typescript
import { Locator } from '@playwright/test';

export class ProductCardComponent {

  private readonly root: Locator;

  constructor(root: Locator) {
    this.root = root;
  }

  private get title() {
    return this.root.getByRole('heading');
  }

  private get addToCartButton() {
    return this.root.getByRole('button', { name: 'Add to cart' });
  }

  async getTitle(): Promise<string> {
    return await this.title.textContent() ?? '';
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
```

**Rules:**
- Takes a scoped `Locator` (not `Page`) in constructor
- All child locators scoped relative to `root`
- Dumb — no orchestration, no multi-page awareness
- Never instantiated from Actions layer directly

---

## Actions Rules

```typescript
import { Page } from '@playwright/test';
import { LoginPage } from '../../ui/pages/LoginPage';

export class LoginActions {

  private readonly loginPage: LoginPage;

  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.fillUsername(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.submit();
  }
}

// Actions that need only a section — receive Section as param
export class FooterActions {

  private readonly footer: FooterSection;

  constructor(footer: FooterSection) {
    this.footer = footer;
  }
}

// Actions that need multiple pages — receive all Pages as params
export class CheckoutActions {

  private readonly cartPage: CartPage;
  private readonly checkoutPage: CheckoutPage;

  constructor(cartPage: CartPage, checkoutPage: CheckoutPage) {
    this.cartPage = cartPage;
    this.checkoutPage = checkoutPage;
  }
}
```

**Rules:**
- Receives Page Objects or Sections via constructor — never instantiates them internally
- Never accesses locators or Components directly
- Method names describe business behaviour, not UI interactions
- Section-based Actions receive Section as constructor param

---

## Verifications Rules

```typescript
import { expect } from '@playwright/test';
import { DashboardPage } from '../../ui/pages/DashboardPage';

export class DashboardVerifications {

  private readonly dashboardPage: DashboardPage;

  constructor(dashboardPage: DashboardPage) {
    this.dashboardPage = dashboardPage;
  }

  async verifyWelcomeMessageVisible(username: string): Promise<void> {
    await expect(this.dashboardPage.getWelcomeMessage()).toContainText(username);
  }
}
```

**Rules:**
- All assertions use Playwright's `expect()` — never raw boolean checks
- Access page state through Page methods — never through locators directly
- Method names start with `verify`

---

## Test File Rules

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../ui/pages/LoginPage';
import { DashboardPage } from '../ui/pages/DashboardPage';
import { LoginActions } from '../steps/actions/LoginActions';
import { DashboardVerifications } from '../steps/verifications/DashboardVerifications';

test.describe('Login', () => {
  test('successful login navigates to dashboard', async ({ page }) => {
    const loginActions = new LoginActions(new LoginPage(page));
    const dashboardVerifications = new DashboardVerifications(new DashboardPage(page));

    await loginActions.loginWithCredentials('user@example.com', 'password123');
    await dashboardVerifications.verifyWelcomeMessageVisible('user@example.com');
  });
});
```

**Rules:**
- No locators in test files — ever
- No setup logic in test body — use fixtures or Actions
- Test reads like a user story — business language only
- One behaviour per test — no multi-assertion sprawl

---

## Locator Priority (highest to lowest)

1. `getByRole()` — preferred for interactive elements
2. `getByLabel()` — preferred for form inputs
3. `getByTestId()` — for elements with `data-testid` attributes
4. `getByText()` — for static text content
5. `getByPlaceholder()` — for inputs without labels
6. XPath — last resort only, with a comment explaining why

---

## Waiting Strategy

```typescript
// ✅ Correct — Playwright auto-waits on actions
await button.click();
await input.fill('text');

// ✅ Correct — explicit condition wait
await page.waitForURL('**/dashboard');
await expect(element).toBeVisible();

// ❌ Never use
await page.waitForTimeout(2000);
```

---

## Fixtures Pattern

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../ui/pages/LoginPage';
import { LoginActions } from '../steps/actions/LoginActions';

type Fixtures = {
  loginActions: LoginActions;
};

export const test = base.extend<Fixtures>({
  loginActions: async ({ page }, use) => {
    await use(new LoginActions(new LoginPage(page)));
  },
});
```

**Rules:**
- Use fixtures instead of `beforeEach` for reusable setup
- Fixtures act as composition root — single place where Pages and Actions are wired
- Fixtures compose — build complex fixtures from simpler ones
- Name fixtures after what they provide, not what they do

---

## AbstractPage Pattern

```typescript
import { Page } from '@playwright/test';

export abstract class AbstractPage {

  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
```

**Rules:**
- Only universal page behaviour here — nothing page-specific
- Never use component on abstract layer
- Sections do NOT extend AbstractPage — they are independent concepts
- All Page classes extend AbstractPage
- `page` property is `protected` — accessible to subclasses only
