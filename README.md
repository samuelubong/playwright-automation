# Playwright Automation – SauceDemo (UI) & Restful Booker (API)

## 1. Project overview

A small, maintainable test automation framework built with Playwright and TypeScript. It contains:

- **UI test**: an end-to-end checkout on [SauceDemo](https://www.saucedemo.com/). It logs in, adds two products, checks the cart, enters customer details, checks that the **Item total** equals the sum of the product prices read from the UI, and completes the order.
- **API test**: a create-and-retrieve flow on [Restful Booker](https://restful-booker.herokuapp.com). It creates a booking, captures the booking ID, fetches the booking and checks that every field (including nested `bookingdates`) matches what was submitted.

## 2. Technologies and tools

| Tool | Purpose |
| --- | --- |
| [Playwright Test](https://playwright.dev/) | Test runner, browser automation, `request` fixture for API tests, HTML reporting |
| TypeScript (strict mode) | Type safety for page objects, test data and API models |
| Node.js 18+ | Runtime |
| Git / GitHub Actions | Version control and CI pipeline |

No extra dependencies are used. The API client uses Playwright's built-in `request` fixture, not Axios or Fetch.

## 3. Folder structure

```text
.
├── tests/
│   ├── ui/checkout.spec.ts          # UI scenario: test steps only
│   └── api/booking.spec.ts          # API scenario: test steps only
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts              # information, overview and complete steps
│   └── components/CartItemList.ts   # item list shared by the Cart and Checkout Overview pages
├── api/
│   └── BookingClient.ts             # create / get booking requests
├── test-data/
│   ├── ui/checkoutData.ts           # credentials, products, customer info, expected messages
│   └── api/bookingData.ts           # booking payload and TypeScript interfaces
├── assertions/
│   ├── ui/checkoutAssertions.ts
│   └── api/bookingAssertions.ts
├── utils/
│   └── priceCalculator.ts           # parse "$29.99" and sum prices
├── config/
│   └── testConfig.ts                # base URLs and required env variable helper
├── .github/workflows/playwright.yml # CI pipeline
├── .env.example                     # template for local secrets (.env is git-ignored)
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 4. Prerequisites

- Node.js **20.12 or newer** (`node -v`); needed for the built-in `.env` loader
- npm
- Internet access (both applications are public websites)

## 5. Installation

```bash
npm install
cp .env.example .env   # then set SAUCE_PASSWORD in .env
```

The SauceDemo password is not stored in the code. It is read from the `SAUCE_PASSWORD` environment variable. Locally, `playwright.config.ts` loads it from `.env`, which is git-ignored. In CI it comes from a GitHub secret. If it is missing, the UI test stops with a clear error. The API test does not need it.

## 6. Install Playwright browsers

The UI project runs on Chromium:

```bash
npx playwright install chromium
```

(Use `npx playwright install --with-deps chromium` on a fresh Linux/CI machine.)

## 7. Run all tests

```bash
npm test
```

## 8. Run UI tests only

```bash
npm run test:ui
# watch the browser:
npm run test:headed
```

## 9. Run API tests only

```bash
npm run test:api
```

Type-check the whole project:

```bash
npm run typecheck
```

## 10. HTML report

Every run creates an HTML report in `playwright-report/`. To open it:

```bash
npm run report
```

If a test fails, the report includes a screenshot (UI) and a Playwright trace. The trace can be opened from the report or with `npx playwright show-trace <path-to-trace.zip>`.

### Configuration via environment variables

| Variable | Default |
| --- | --- |
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `API_BASE_URL` | `https://restful-booker.herokuapp.com` |
| `SAUCE_USERNAME` | `standard_user` |
| `SAUCE_PASSWORD` | **required**, no default (`.env` locally, GitHub secret in CI) |
| `CI` | when set: 1 retry, `test.only` is not allowed |

### Continuous integration (GitHub Actions)

`.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can also be started manually from the **Actions** tab (*Run workflow*). The job:

1. Installs dependencies (`npm ci`) and Chromium.
2. Runs the TypeScript type check.
3. Runs all tests **headless**. This is Playwright's default when `--headed` is not passed.
4. Uploads the HTML report as the `playwright-report` artifact, on pass or fail. If a test fails, it also uploads `test-results` (screenshots and traces).

**One-time setup:** in the GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret**. Create a secret named `SAUCE_PASSWORD` with value `secret_sauce`. The workflow fails early with a clear message if the secret is missing. `SAUCE_USERNAME` can optionally be set as a repository **variable**. It defaults to `standard_user`.

**Viewing the CI report:** open the workflow run, download the `playwright-report` artifact, unzip it, and run `npx playwright show-report <unzipped-folder>`.

## 11. Framework architecture and Page Object Model

```text
spec file ──uses──> Page Objects / BookingClient ──interact with──> app / API
    │                         │
    ├──reads──> test-data     └──uses──> utils (price parsing)
    └──verifies with──> assertions (Playwright expect)
```

**Page Object Model (POM).** Each SauceDemo page has its own class. The class holds the page's locators as named `readonly` properties and exposes methods for user actions, for example `login(credentials)`, `addProductsToCart(names)`, `proceedToCheckout()` and `finishCheckout()`. Page objects never assert anything. They only find elements and perform actions, and they return values such as prices when a test needs them.

- Locators use SauceDemo's `data-test` attributes through `page.getByTestId()` (`testIdAttribute` is set to `data-test` in the config). These are the most stable selectors the site offers.
- Products are found **by name**, for example `inventoryItems.filter({ hasText: 'Sauce Labs Backpack' })`. Adding a different product only requires a change to the test data.
- The Cart page and the Checkout Overview page show the same item list markup. That list lives in one small component, `CartItemList`, which both pages reuse, so its locators are not duplicated.
- No `waitForTimeout` is used anywhere. Playwright's auto-waiting actions and web-first assertions (`toHaveURL`, `toHaveText`) wait for real application states.

**API client.** `BookingClient` wraps Playwright's `APIRequestContext`, which the test gets from the `request` fixture. It returns the raw `APIResponse`, so assertions can check status codes as well as bodies. The base URL comes from the `api` project in `playwright.config.ts`.

**Projects.** `playwright.config.ts` defines two projects: `ui`, which uses Desktop Chrome and the SauceDemo base URL, and `api`, which uses no browser and the Restful Booker base URL. One config supports both test types, and either can be run on its own with `--project`.

## 12. Test data separation

All inputs live in `test-data/`. Test files contain none:

- `test-data/ui/checkoutData.ts`: user credentials (overridable through env variables), the products to buy, customer information, and expected UI messages.
- `test-data/api/bookingData.ts`: the booking payload and the `Booking`, `BookingDates` and `CreateBookingResponse` interfaces.

Changing a product, customer or booking value means editing one data file. No test logic changes.

**Product prices are never hardcoded.** They are read from the checkout overview at runtime, and the expected total is calculated with `utils/priceCalculator.ts`.

## 13. Assertion separation

Assertions live in `assertions/ui` and `assertions/api`. They accept locators, values or `APIResponse` objects and check them with Playwright's `expect`. Each assertion has a descriptive message.

- UI: `expectUserLoggedIn`, `expectCartContainsOnly`, `expectItemTotalMatchesPrices`, `expectOrderConfirmed`.
- API: `expectBookingCreated` checks the status, that the booking ID is a positive integer, and the echoed booking, then returns the parsed body so the test can use the ID. `expectBookingRetrieved` checks the status and body. `expectBookingToMatch` checks **each field individually**, including `bookingdates.checkin` and `bookingdates.checkout`, so a failure names the exact field. A final `toStrictEqual` catches any unexpected extra fields.

The spec files therefore read as a sequence of business steps.

## 14. Implementation decisions

- **Simple composition, no inheritance.** There is no `BasePage`. The pages are small, and sharing happens through one component (`CartItemList`) and one utility (`priceCalculator`).
- **One `CheckoutPage` for the three checkout steps** (information, overview and complete), as the brief's structure suggests. Locators are grouped by step with comments.
- **Price maths rounds to 2 decimal places.** In floating point, `29.99 + 9.99 = 39.980000000000004`. `calculateTotal` rounds so the comparison with the displayed `$39.98` is exact.
- **`test.step` blocks** in the UI test make the HTML report readable without adding logic to the spec.
- **Secrets come from the environment.** The password is never committed. It is read through `getRequiredEnv()` from `.env` locally and from GitHub secrets in CI.
- **Strict TypeScript** with `noUnusedLocals` and `noUnusedParameters`, so unused code fails `npm run typecheck`.
- **Status codes.** Restful Booker returns `200` (not `201`) for `POST /booking`. The test asserts the documented behaviour (`200`).
- **Shared public sandbox.** Restful Booker is a public demo server that is regularly reset and sometimes unavailable (see the observation below). The config retries once on CI to reduce noise from that.

## 15. Defects found during exploration

Both issues were reproduced manually and with a scripted Playwright session on 2026-11-02, using `standard_user`.

### Defect 1: An order can be placed with an empty cart

- **Description:** The checkout flow has no check that the cart contains items. A user can complete a $0.00 "order" and get the success confirmation.
- **Steps to reproduce:**
  1. Log in as `standard_user` / `secret_sauce`.
  2. Without adding any product, click the cart icon.
  3. Click **Checkout**.
  4. Enter First Name `Samuel`, Last Name `Ubong`, Postal Code `10001` and click **Continue**.
  5. Click **Finish**.
- **Expected result:** Checkout is disabled, or an error says the cart is empty. No order can be submitted without items.
- **Actual result:** The overview shows `Item total: $0` and `Total: $0.00`. Clicking **Finish** shows "Thank you for your order!".
- **Severity:** Medium. This is a business-logic gap that would create empty orders. It does not block the main purchase flow.
- **Related observation (Low):** On this screen the Item total is formatted `$0`, while Tax and Total are formatted `$0.00`. Currency formatting is inconsistent.

### Defect 2: Checkout accepts whitespace-only customer information

- **Description:** The "Your Information" form treats spaces as valid input. The required-field check only looks for an empty string.
- **Steps to reproduce:**
  1. Log in as `standard_user` and add any product to the cart.
  2. Open the cart and click **Checkout**.
  3. Enter a few spaces in First Name, Last Name and Postal Code.
  4. Click **Continue**, then **Finish**.
- **Expected result:** A validation error such as "Error: First Name is required", the same as for an empty field.
- **Actual result:** No error is shown. The user moves to the overview and can complete the order with blank customer details.
- **Severity:** Medium. Orders can be created without usable customer or shipping data.

### Observation (not reported as a confirmed defect): Restful Booker intermittent 500 errors

During exploration, `POST /booking` with the **valid** payload from this assessment sometimes returned `500 Internal Server Error`. The same request returned `200` minutes before and after. Invalid payloads (missing fields, checkout before check-in, negative price) also returned `500`. Valid requests were failing at the same time, so it was **not possible to confirm** whether the API validates input or simply crashes on bad input. This is recorded as an availability observation of the public sandbox, not as a confirmed defect.
