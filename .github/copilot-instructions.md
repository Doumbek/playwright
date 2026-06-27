# GitHub Copilot Instructions

## Project Overview
Test automation learning project. Goal: master the full test automation
lifecycle — from clean code to CI/CD pipelines — using TypeScript, Playwright,
and GitHub Actions, enhanced by AI-assisted workflows.

---

## Stack
- **Language:** TypeScript (strict mode — `strict: true` always enforced)
- **Runtime:** Node.js 18+
- **Test framework:** Playwright
- **CI/CD:** GitHub Actions
- **AI tools:** GitHub Copilot (implementation), Claude (architecture & review)

---

## Project Structure
```
project-root/
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/
│       └── playwright.instructions.md
├── api/
│   ├── api.client.ts      # ApiClient — typed wrapper around APIRequestContext
│   ├── endpoints.ts       # API path constants (as const)
│   ├── http.status.ts     # HttpStatus const object + exported type
│   └── types/             # Response and request payload interfaces
├── config/                # Environment config files
│   ├── environments.json  # Environment-specific URLs and settings
│   ├── .env.dev           # Local dev secrets (gitignored)
│   └── .env.stage         # Stage secrets (gitignored)
├── data/                  # Test data
│   ├── builders/          # Object construction with Partial<T> overrides
│   ├── providers/         # Test dataset functions per test scenario
│   └── types/             # Test data shape interfaces
├── fixtures/              # Playwright fixtures
├── steps/
│   ├── actions/           # Business action steps
│   └── verifications/     # Assertion steps
├── tests/                 # Test files only — no logic here
├── ui/
│   ├── pages/             # Page Object classes
│   ├── sections/          # Section classes (independent, reusable)
│   └── components/        # Component classes (owned by Pages)
├── utils/                 # Shared helpers, types, constants
├── playwright.config.ts
└── tsconfig.json
```

**Directory conventions:**
- Dot prefix → tooling directories (`.github`)
- Flat layout — no `src/` wrapper (matches Node/Playwright community convention)
- `config/` holds environment files and settings — separate from framework code

---

## Architecture — 5-Layer Model

```
Tests
  └── Steps (Actions + Verifications)
        └── Pages / Sections
              └── Components
                    └── Locators (public getters — used by Verifications via expect())
```

> **Pages and Sections are independent and parallel concepts — not a hierarchy.**
> Sections do NOT extend AbstractPage and are NOT mounted on it.
> A Section is like a Page without a URL — independent, takes `Page` in constructor,
> owns its locator root, usable from any context.
> A Component is owned by a Page — scoped, instantiated by the Page that contains it.

**Rules — never violate these:**
1. Each layer calls only one level down — never skip layers
2. Locators are public getters — used by Verifications layer via `expect(locator)` only
3. Actions layer never accesses locators directly — only through public Page/Section methods
4. Pages/Sections own Components — Components expose methods, never raw locators to Actions

---

## Layer Responsibilities

### Pages (`ui/pages/`)
- Represent a full page with a URL
- Extend AbstractPage
- Instantiate Components with scoped locators via factory methods
- Expose public locator getters — consumed by Verifications layer only
- Expose public action methods — consumed by Actions layer
- Page methods that purely delegate to a component with no added logic should be removed
- Actions layer accesses component methods directly through the Page's component getter
- Keep Page methods only when they add real orchestration value beyond simple delegation

### Sections (`ui/sections/`)
- Independent — instantiated with `Page` directly, not tied to any specific Page class
- A Section is a Page without a URL — same independence, smaller scope
- Own their locator root as `private readonly root: Locator`
- Do NOT extend AbstractPage — they are not part of the Page hierarchy
- Expose public locator getters — consumed by Verifications layer only
- Expose public action methods — consumed by Actions layer
- Examples: `NavigationSection`, `FooterSection`, `AlertSection`

### Components (`ui/components/`)
- Owned by Pages — instantiated by the Page that contains them
- Receive a scoped `Locator` from their parent Page in constructor
- Expose `self` getter — returns root Locator for component-level assertions
- Expose public locator getters — consumed by Verifications layer only
- Expose public action methods — consumed through Page's component getter
- Dumb — no orchestration, no multi-page awareness
- Never accessed directly from the Actions layer
- Examples: `ProductCardComponent`, `CheckoutCartComponent`

### Steps — Actions (`steps/actions/`)
- Orchestrate business flows using Pages and Sections
- Receive Pages or Sections via constructor — never instantiate them internally
- Never access locators directly — only call public Page/Section action methods
- Every public method body wrapped in `test.step()` — makes business steps visible in terminal and HTML report
- Step name format: `ClassName: methodName [key diagnostic parameter]`
- May include complex flows for precondition setup only (e.g. `CheckoutFlow`)
- Business steps that tests care about stay visible at test layer — never hidden in flows
- Method names describe business behaviour, not UI interactions

### Steps — Verifications (`steps/verifications/`)
- Assertion-focused counterpart to Actions
- Receive Pages or Sections via constructor — same pattern as Actions
- Use public locator getters from Pages/Sections/Components to pass into `expect()`
- Every public method body wrapped in `test.step()` — same pattern as Actions
- Step name format: `ClassName: methodName [key diagnostic parameter]`
- Never call action methods — read state only
- All assertions use Playwright's `expect()` — never raw boolean checks
- Method names start with `verify`

### AbstractPage (`ui/pages/abstract.page.ts`)
- Holds only universal page behaviour
- Exposes `protected goto(path)` — used by subclass `open()` methods
- Exposes `protected waitForURL(url)` — used by subclass `open()` methods
- Never holds locators or component references
- Sections do NOT extend or relate to AbstractPage — they are independent
- All Page classes extend AbstractPage

---

## API Layer Architecture

```
Tests / ApiActions
  └── ApiClient (public endpoint methods)
        └── Private infrastructure (parseAs<T>, checkResponseStatus)
              └── Private transport (get, post, put, delete)
```

**ApiClient rules — never violate these:**
1. Transport methods are private — never called from outside the class
2. Sugar methods wrap raw methods with typed defaults — never duplicate transport calls
3. `<T>` generics only on infrastructure and raw methods — sugar methods have specific return types
4. baseURL lives on APIRequestContext, not on ApiClient — set at context creation in fixtures
5. Request payload types are separate from response types — never share interfaces across boundary

**Layer responsibilities:**

### ApiClient (`api/api.client.ts`)
- Wraps `APIRequestContext` via `ClientOptions` constructor injection
- Three internal layers: private transport / private infrastructure / public endpoint methods
- Transport methods log every HTTP call before executing: `console.log('[METHOD] path - body: ...')`
- Logging lives in transport only — endpoint methods and ApiActions express intent, not wire detail
- Sugar methods: typed params, sensible status defaults, specific return types
- Raw (`As`) methods: `body: unknown`, caller controls `HttpStatus` and return type `<T>`
- No orchestration — one HTTP call per method

### ApiActions (`steps/actions/api.actions.ts`)
- Orchestrates multi-step API flows (register + getCurrentUser → User)
- Receives `ApiClient` via constructor — never instantiates it internally
- Returns meaningful objects to tests and builders

### Data Builders (`data/builders/`)
- Build request payload objects with sensible defaults
- Accept Partial<T> overrides — caller specifies only what differs
- No HTTP calls — pure construction logic
- Example: buildRegisterUserData(overrides?)

### Data Providers (`data/providers/`)
- Exported as functions — never module-level constants (avoids caching)
- Return typed test dataset arrays for specific test scenarios
- Use builders internally, add test-specific expected values
- Example: getCreateNewOrderCheckoutDataSet(): CreateNewOrderCheckoutTestData[]

### Data Types (`data/types/`)
- Test data shape interfaces — separate from API contract types in api/types/
- Example: CreateNewOrderCheckoutTestData
- Never share with api/types/ — different responsibilities, will diverge

---

## Coding Rules

### TypeScript
- Always use strict mode — no `any`, no implicit types
- Prefer `interface` for object shapes, `type` for unions and aliases
- All async methods must be explicitly typed with explicit return type
- All locators are `public get` getters — unified across Pages, Sections, Components
- Locator getters used by Actions layer is a codestyle violation — getters are for Verifications only
- Constructor parameters are always explicitly declared as fields and assigned in constructor body
- Never use TypeScript shorthand `constructor(private readonly x)` — always explicit declaration + assignment
- `public` keyword used explicitly on all public members — enforced by ESLint explicit-member-accessibility rule
- Sugar/raw naming convention for API endpoint methods — getProducts() / getProductsAs<T>(status)
- Generic <T> only where method genuinely works for any type — not on business-specific sugar methods
- HttpStatus const object used for all status code references — never magic numbers
- void async methods use await internally, not return a raw Promise — ensures proper error handling and stack traces

### Playwright
- Prefer semantic locators: `getByRole()`, `getByLabel()`, `getByTestId()`
- Avoid CSS selectors and XPath unless no semantic alternative exists — add a comment explaining why
- Never use `page.waitForTimeout()` — use proper waiting strategies
- Never hardcode timeouts inline — use config or named constants
- Always `await` Playwright actions — missing await is the #1 source of flakiness

### General
- No magic strings — use constants, union types, or enums
- No copy-paste setup in tests — use fixtures
- Every public method has a clear, behaviour-describing name
- Comments explain *why*, not *what*

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Page classes | `PascalCase` + `Page` suffix | `LoginPage`, `SearchPage` |
| Section classes | `PascalCase` + `Section` suffix | `NavigationSection`, `AlertSection` |
| Component classes | `PascalCase` + `Component` suffix | `ProductCardComponent` |
| Action classes | `PascalCase` + `Actions` suffix | `LoginActions`, `FooterActions` |
| Verification classes | `PascalCase` + `Verifications` suffix | `LoginVerifications` |
| Locator getters | `public get`, camelCase, explicit return type | `public get submitButton(): Locator` |
| Constructor fields | `private readonly`, camelCase | `private readonly loginPage: LoginPage` |
| Test files | `kebab-case.spec.ts` | `login.spec.ts` |
| Fixture files | `kebab-case.fixture.ts` | `auth.fixture.ts` |

---

## What Copilot Should Never Suggest
- Locators defined inside methods — always define as getters
- `page.waitForTimeout()` for waiting
- CSS selectors or XPath when a semantic alternative exists
- Logic or assertions directly inside test files
- Actions layer accessing locator getters directly — locators passed to `expect()` only
- Direct access to Component instances from Actions layer
- `any` type without explicit justification
- Sections extending AbstractPage or being mounted on it
- TypeScript constructor shorthand `constructor(private readonly x)` — always explicit
- Magic number HTTP status codes — always use HttpStatus constants
- baseURL stored on ApiClient — it belongs on APIRequestContext at context creation
- Shared interfaces for request payloads and response types — always separate
- Generic <T> on sugar methods — they have specific return types
- Transport methods called from outside ApiClient — they are always private
- Actions or Verifications methods without `test.step()` wrapping — every public method must be wrapped
- `console.log` in endpoint methods or ApiActions — logging belongs in transport layer only
- Suppressing ESLint rules via eslint-disable comments without an explanation comment — always document why a rule is suppressed if it genuinely needs to be