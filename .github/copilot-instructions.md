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
├── data/                  # Playwright test data
│   ├── factories/         # Dynamic data generation
│   └── providers/         # Static data objects
├── fixtures/              # Playwright fixtures
├── steps/
│   ├── actions/           # business action steps
│   └── verifications/     # assertion steps
├── tests/                 # test files only — no logic here
├── ui/
│   ├── pages/             # Page Object classes
│   ├── sections/          # Section classes (independent, reusable)
│   └── components/        # Component classes (owned by Pages)
├── utils/                 # shared helpers, types, constants
├── playwright.config.ts
└── tsconfig.json
```

**Directory conventions:**
- Dot prefix → tooling directories (`.github`)
- Flat layout — no `src/` wrapper (matches Node/Playwright community convention)

---

## Architecture — 5-Layer Model

```
Tests
  └── Steps (Actions + Verifications)
        └── Pages / Sections
              └── Components
                    └── Locators (private — never exposed above owner)
```

> **Pages and Sections are independent and parallel concepts — not a hierarchy.**
> Sections do NOT extend AbstractPage and are NOT mounted on it.
> A Section is like a Page without a URL — independent, takes `Page` in constructor,
> owns its locator root, usable from any context.
> A Component is owned by a Page — scoped, dumb, never independent.

**Rules — never violate these:**
1. Each layer calls only one level down — never skip layers
2. Locators are always `private` — public interface is methods (behaviour), never elements
3. Actions/Verifications layers orchestrate — Pages/Sections only expose atomic methods
4. Pages/Sections own Components (complex area as wrapper for Locators) or Locators directly

---

## Layer Responsibilities

### Pages (`ui/pages/`)
- Represent a full page with a URL
- Instantiate Components with scoped locators
- Extend AbstractPage
- Expose public methods — never expose locators or component instances directly

### Sections (`ui/sections/`)
- Independent — instantiated with `Page` directly, not tied to any specific Page class
- Think of a Section as a Page without a URL — same independence, smaller scope
- Own their locator root
- Do NOT extend AbstractPage — they are not part of the Page hierarchy
- Examples: `NavigationSection`, `FooterSection`

### Components (`ui/components/`)
- Owned by Pages — instantiated by the Page that contains them
- Receive a scoped `Locator` from their parent Page
- Dumb — locators + atomic methods only, no orchestration
- Never accessed directly from the Actions layer
- Examples: `ProductCardComponent`, `SearchResultComponent`

### Steps — Actions (`steps/actions/`)
- Orchestrate business flows using Pages and Sections
- Might include complex one-method flows for precondition setup (e.g. `CheckoutFlow`)
- Business steps that tests care about stay visible at test layer — never hidden in flows
- Section-based Actions (e.g. `FooterActions`): receive Section as constructor param
- Components: accessed only through Page's public methods, never directly

### Steps — Verifications (`steps/verifications/`)
- Assertion-focused counterpart to Actions
- Same layer rules apply — use Page/Section methods, never locators

### AbstractPage (`ui/pages/AbstractPage.ts`)
- Holds only universal page behaviour: `open()`, `waitForNetworkIdle()`, etc.
- Never use component on abstract layer
- Sections do NOT extend or relate to AbstractPage — they are independent
- All Page classes extend AbstractPage

---

## Coding Rules

### TypeScript
- Always use strict mode — no `any`, no implicit types
- Prefer `interface` for object shapes, `type` for unions and aliases
- All async methods must be explicitly typed with return type
- All locators are `private get` getters — Pages, Sections, and Components unified
- Constructor parameters are always explicitly declared as `private readonly` fields and assigned in constructor body — never use TypeScript shorthand `constructor(private readonly x)`

### Playwright
- Prefer semantic locators: `getByRole()`, `getByLabel()`, `getByTestId()`
- Avoid CSS selectors and XPath unless absolutely necessary
- Never use `page.waitForTimeout()` — use proper waiting strategies
- Never hardcode timeouts inline — use config or named constants
- Always `await` Playwright actions — missing await is the #1 source of flakiness

### General
- No magic strings — use constants, union types or enums
- No copy-paste setup in tests — use fixtures
- Every public method has a clear, behaviour-describing name
- Comments explain *why*, not *what*

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Page classes | `PascalCase` + `Page` suffix | `LoginPage`, `SearchPage` |
| Section classes | `PascalCase` + `Section` suffix | `NavigationSection` |
| Component classes | `PascalCase` + `Component` suffix | `ProductCardComponent` |
| Action classes | `PascalCase` + `Actions` suffix | `LoginActions`, `FooterActions` |
| Verification classes | `PascalCase` + `Verifications` suffix | `LoginVerifications` |
| Locator properties | `private get`, camelCase | `private get submitButton(): Locator` |
| Constructor fields | `private readonly`, camelCase | `private readonly loginPage: LoginPage` |
| Test files | `kebab-case.spec.ts` | `login.spec.ts` |
| Fixture files | `kebab-case.fixture.ts` | `auth.fixture.ts` |

---

## What Copilot Should Never Suggest
- Public locator properties on any class
- Locators defined inside methods instead of as private getters
- `page.waitForTimeout()` for waiting
- CSS selectors when a semantic alternative exists
- Logic or assertions directly inside test files
- Direct access to Component instances from Actions layer
- `any` type without explicit justification
- Sections extending AbstractPage or being mounted on it
