---
applyTo: "**/*.ts"
---

# Playwright-Specific Instructions

These rules apply to all TypeScript files in the project.

---

## Page Object Rules

### Structure — every Page class must follow this pattern
```typescript
import { Page, Locator } from '@playwright/test';
import { AbstractPage } from '@pages/abstract.page';

export class LoginPage extends AbstractPage {

  // 1. Constructor — takes Page, calls super
  public constructor(page: Page) {
    super(page);
  }

  // 2. Navigation — each page owns its own path and open() signature
  public async open(): Promise<void> {
    await this.goto(this.getPath());
    await this.waitForURL('**/auth/login');
  }

  private getPath(): string {
    return '/auth/login';
  }

  // 3. Public locator getters — consumed by Verifications via expect() only
  public get emailInput(): Locator {
    return this.page.getByPlaceholder('Your email');
  }

  public get submitButton(): Locator {
    return this.page.getByTestId('login-submit');
  }

  // 4. Public action methods — consumed by Actions layer
  public async setEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  public async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }
}
```

**Rules:**
- Locators defined as `public get` getters — never inline inside methods
- Locator getters consumed by Verifications layer via `expect(locator)` only
- Actions layer never uses locator getters — only calls action methods
- All action methods are `async` with explicit return types
- No assertions inside Page classes — assertions belong in Verifications
- `open()` always calls `goto()` + `waitForURL()` — navigation is not complete without URL verification
- Dynamic pages override `open()` with a typed parameter: `open(productId: string)`

---

## Section Rules

> A Section is like a Page without a URL — independent, takes `Page` in constructor,
> owns its locator root, usable from any context.
> Sections do NOT extend AbstractPage — they are not part of the Page hierarchy.

```typescript
import { Page, Locator } from '@playwright/test';

export class NavigationSection {

  private readonly root: Locator;

  // Constructor — takes Page directly, independent of any specific Page class
  public constructor(page: Page) {
    this.root = page.locator('nav');
  }

  // Public locator getters — consumed by Verifications via expect() only
  public get cartQty(): Locator {
    return this.root.getByTestId('cart-quantity');
  }

  // Public action methods — consumed by Actions layer
  public async clickCartIcon(): Promise<void> {
    await this.root.getByTestId('cart').click();
  }
}
```

**Rules:**
- Takes `Page` directly in constructor — independent of any specific Page class
- Does NOT extend AbstractPage — independent concept, not part of Page hierarchy
- Owns its locator root as `private readonly root: Locator`
- Public locator getters for Verifications, public action methods for Actions
- No orchestration logic inside Section — atomic methods only

---

## Component Rules

```typescript
import { Locator } from '@playwright/test';

export class ProductCardComponent {

  private readonly root: Locator;

  // Constructor — takes scoped Locator from parent Page
  public constructor(root: Locator) {
    this.root = root;
  }

  // self — exposes root Locator for component-level assertions
  // e.g. await expect(card.self).toBeVisible()
  public get self(): Locator {
    return this.root;
  }

  // Public locator getters — consumed by Verifications via expect() only
  public get title(): Locator {
    return this.root.getByTestId('product-name');
  }

  // Public action methods — consumed through Page's component getter
  public async click(): Promise<void> {
    await this.root.click();
  }
}
```

**Rules:**
- Takes a scoped `Locator` (not `Page`) in constructor
- All child locators scoped relative to `root`
- Exposes `self` getter — returns root Locator for component-level assertions
- All locator getters are explicit return type `: Locator`
- Dumb — no orchestration, no multi-page awareness
- Never instantiated from Actions layer directly — accessed through Page's getter

---

## Actions Rules

```typescript
import { LoginPage } from '@pages/login.page';

export class LoginActions {

  private readonly loginPage: LoginPage;

  public constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  public async loginAs(email: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.setEmail(email);
    await this.loginPage.setPassword(password);
    await this.loginPage.clickSubmitButton();
  }
}
```

```typescript
// Actions that need a Section — receive Section as constructor param
export class NavigationActions {

  private readonly navigation: NavigationSection;

  public constructor(navigation: NavigationSection) {
    this.navigation = navigation;
  }

  public async goToCart(): Promise<void> {
    await this.navigation.clickCartIcon();
  }
}
```

```typescript
// Actions that need multiple Pages — receive all as constructor params
export class CheckoutActions {

  private readonly homePage: HomePage;
  private readonly checkoutPage: CheckoutPage;

  public constructor(homePage: HomePage, checkoutPage: CheckoutPage) {
    this.homePage = homePage;
    this.checkoutPage = checkoutPage;
  }
}
```

**Rules:**
- Receives Page Objects or Sections via constructor — never instantiates them internally
- Never accesses locator getters — only calls public action methods on Pages/Sections
- Components accessed through Page's component getter, never directly
- Method names describe business behaviour, not UI interactions

---

## Verifications Rules

```typescript
import { expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';

export class LoginVerifications {

  private readonly loginPage: LoginPage;

  public constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  // Uses public locator getter — passes Locator directly to expect()
  public async verifyEmailInputVisible(): Promise<void> {
    await expect(this.loginPage.emailInput).toBeVisible();
  }

  public async verifyErrorMessage(message: string): Promise<void> {
    await expect(this.loginPage.errorMessage).toHaveText(message);
  }
}
```

**Rules:**
- All assertions use Playwright's `expect()` — never raw boolean checks
- Uses public locator getters from Pages/Sections/Components — passes to `expect()` directly
- Never calls action methods — reads state only
- Method names start with `verify`

---

## Test File Rules

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { AccountPage } from '@pages/account.page';
import { LoginActions } from '@steps/actions/login.actions';
import { LoginVerifications } from '@steps/verifications/login.verifications';

test.describe('Login', () => {
  test('successful login navigates to account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const loginActions = new LoginActions(loginPage);
    const loginVerifications = new LoginVerifications(loginPage);

    await loginActions.loginAs('user@example.com', 'password123');
    await accountPage.waitUntilOpened();
    await loginVerifications.verifyEmailInputVisible();
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
import { LoginPage } from '@pages/login.page';
import { LoginActions } from '@steps/actions/login.actions';
import { LoginVerifications } from '@steps/verifications/login.verifications';

type Fixtures = {
  loginActions: LoginActions;
  loginVerifications: LoginVerifications;
};

export const test = base.extend<Fixtures>({
  loginActions: async ({ page }, use) => {
    await use(new LoginActions(new LoginPage(page)));
  },
  loginVerifications: async ({ page }, use) => {
    await use(new LoginVerifications(new LoginPage(page)));
  },
});
```

**Rules:**
- Use fixtures instead of `beforeEach` for reusable setup
- Fixtures act as composition root — single place where Pages, Actions, and Verifications are wired
- Fixtures compose — build complex fixtures from simpler ones
- Name fixtures after what they provide, not what they do

---

## AbstractPage Pattern

```typescript
import { Page } from '@playwright/test';

export abstract class AbstractPage {

  protected readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  // Navigation utility — used by subclass open() methods
  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  // URL verification utility — always called after goto()
  protected waitForURL(url: string | RegExp): Promise<void> {
    return this.page.waitForURL(url);
  }
}
```

**Rules:**
- Only universal navigation utilities here — nothing page-specific
- `goto()` and `waitForURL()` are `protected` — available to subclasses only
- Never holds locators or component references
- Sections do NOT extend AbstractPage — they are independent concepts
- All Page classes extend AbstractPage
- `page` property is `protected` — accessible to subclasses only

---

## ApiClient Pattern

```typescript
// api/api.client.ts
import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ClientOptions {
  context: APIRequestContext;
}

export class ApiClient {

  private readonly context: APIRequestContext;

  public constructor(options: ClientOptions) {
    this.context = options.context;
  }

  // ── Private transport ──────────────────────────────────────────
  private async get(path: string): Promise<APIResponse> {
    return this.context.get(path);
  }

  private async post(path: string, body: unknown): Promise<APIResponse> {
    return this.context.post(path, { data: body });
  }

  // ── Private infrastructure ─────────────────────────────────────
  private async parseAs<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  private checkResponseStatus(response: APIResponse, expectedStatus: HttpStatus): void {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `Expected status [${expectedStatus}]. Received [${response.status()}].\n URL: [${response.url()}]`
      );
    }
  }

  // ── Public endpoint methods ────────────────────────────────────
  public async getProducts(): Promise<Product[]> {
    return this.getProductsAs<Product[]>(HttpStatus.OK);
  }

  public async getProductsAs<T>(expectedStatus: HttpStatus): Promise<T> {
    const response = await this.get(endpoints.products);
    this.checkResponseStatus(response, expectedStatus);
    return this.parseAs<T>(response);
  }
}
```

**Rules:**
- `ClientOptions` takes `context: APIRequestContext` only — `baseURL` set on context at creation
- Three internal layers: transport (private) → infrastructure (private) → endpoint methods (public)
- Sugar method: typed return, default status — zero boilerplate at call site
- Raw (`As`) method: `<T>` generic return, caller controls `HttpStatus`
- `body: unknown` on transport and raw methods — sugar methods use specific payload types
- `parseAs<T>` uses `response.json() as T` — compile-time label, runtime parsing by Playwright
- `checkResponseStatus` throws with status + URL — enough context to debug without a trace

--- 

**HttpStatus pattern:**
```typescript
// api/http.status.ts
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;

export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];
```

---

**Endpoints pattern:**
```typescript
// api/endpoints.ts
export const endpoints = {
  products: '/products',
  register: '/auth/register',
  login: '/auth/login',
  me: '/auth/me',
} as const;
```

---

**Type separation pattern:**
```typescript
// Request payload — what you send
export interface RegisterUserData {
  email: string;
  password: string;
}

// Response — what comes back
export interface User {
  id: string;
  email: string;
}
// Never share these interfaces — they have different responsibilities and will diverge
```
