# Swag Labs Test Automation Framework

This document contains a test automation guide for [SauceDemo](https://www.saucedemo.com/) built with Playwright and TypeScript. This project shows industry best practices including Page Object Model, custom fixtures, authentication state reuse, and cross-browser testing.

## Table of Contents

- [Test Approach](#test-approach)
- [Key Design Patterns](#key-design-patterns)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Test Pyramid Perspective](#test-pyramid-perspective)
- [Cross-Browser Strategy](#cross-browser-strategy)
- [Configuration](#configuration)

## Test Approach

### Selected User Flows and Prioritization Rationale

After analyzing the SauceDemo application, I selected **two critical user flows** based on business impact, risk assessment, the importance of user experience, and of course time:

#### 1. Login Flow (Authentication)

**Why this flow?**
- **Gateway to functionality**: Login is the entry point to all application features
- **Security-critical**: Protects user data and prevents unauthorized access
- **High risk area**: Authentication bugs affect 100% of users

**Test Coverage:**
- Successful login with valid credentials
- Failed login scenarios (invalid username, password, empty fields)
- Session persistence and logout functionality

#### 2. Shopping Cart Management

**Why this flow?**
- **Pre-requisite for checkout**: Broken cart functionality = no purchases
- **High interaction frequency**: Users frequently modify cart contents
- **Revenue metric**: Cart abandonment is a key business metric
- **Complex state management**: Cart state must persist across pages

**Test Coverage:**
- Add/remove items from multiple entry points
- Cart persistence across navigation

## Key Design Patterns

#### Page Object Model (POM)
Each page has a dedicated class encapsulating:
- Page locators
- User interactions
- Navigation helpers

#### Custom Fixtures
Page objects are instantiated via Playwright fixtures, enabling:
- Automatic dependency injection
- Clean test setup/teardown
- Acts as a singleton pattern to prevent several broser instances in memory

#### Storage State Authentication
Login is performed once in a setup project, and the authentication state is reused:
- Eliminates redundant login per test
- Significantly faster test execution
- Consistent authentication across all tests

## Setup Instructions

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work for SauceDemo)
   ```

5. **Create auth directory**
   ```bash
   mkdir -p src/tests/.auth
   ```

### Verify Installation

```bash
# Run a quick test to verify setup
npm run test:chromium
```

```bash
# Run all the tests cross-browser approach
npm test
```

## Running Tests

### Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests on all configured browsers |
| `npm run test:chromium` | Run tests on Chromium only |
| `npm run test:firefox` | Run tests on Firefox only |
| `npm run test:webkit` | Run tests on WebKit (Safari) only |
| `npm run test:headed` | Run tests with browser UI visible |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run report` | View HTML test report |
| `npm run clean` | Clean test artifacts |

### Running Specific Tests

```bash

# Run a specific test file
npx playwright test src/tests/cart.spec.ts

### Debug Mode

```bash
# Step through tests with Playwright Inspector
npm run test:debug

# Run with trace viewer
npx playwright test --trace on
```

---

## Test Pyramid Perspective

### Current Implementation: E2E Layer

This framework operates at the **E2E (End-to-End) layer** on the automation pyramid:

- **What it tests**: It checks full user flows, just like a real user using the website in a browser
- **Scope**:  It covers everything end to end — the UI, and frontend behavior
- **Speed**: It’s the slowest type of test because it runs through the whole system
- **Maintenance**: It needs more updates since UI changes can break tests
- **Confidence**: It gives the most business confidence because it verifies what real users actually see and do

### Integration/API-Level Tests

If I had access to the backend API, here's how we would approach integration tests:

```typescript
// Example: Integration Test for Inventory API
import { test, expect, APIRequestContext } from '@playwright/test';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

test.describe('Inventory API Integration Tests', () => {
  let apiContext: APIRequestContext;
  let authToken: string;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://api.saucedemo.com', // Hypothetical API
    });

    // Authenticate to get token
    const response = await apiContext.post('/auth/login', {
      data: {
        username: 'standard_user',
        password: 'secret_sauce',
      },
    });
    const data: LoginResponse = await response.json();
    authToken = data.access_token;
  });

  test('GET /products should return all products', async () => {
    const response = await apiContext.get('/products', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);

    const products: Product[] = await response.json();
    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);

    // Validate product schema
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');
    });
  });

  test('POST /cart should add item to cart', async () => {
    const response = await apiContext.post('/cart/items', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { product_id: 1, quantity: 2 },
    });

    expect(response.status()).toBe(201);

    const cart = await response.json();
    expect(cart.items).toContainEqual(
      expect.objectContaining({ product_id: 1, quantity: 2 })
    );
  });
});
```

**Note:** To validate JSON schemas I would use an external libray like [Ajv](https://ajv.js.org/)

## Cross-Browser Strategy

### Which Tests Should Run Cross-Browser?

Based on risk analysis and ROI, here's the recommended cross-browser strategy:

#### Always Cross-Browser (Critical Path)

| Test Suite | Reason |
|------------|--------|
| Login Flow | Security-critical; browser differences in form handling |
| Checkout Flow | Revenue-critical; payment forms vary by browser |
| Core Cart Operations | Business-critical; JavaScript behavior varies |

### Browser Priority Matrix

```
Priority 1: Chromium (Chrome, Edge)
├── widely used in the market
├── Primary development browser
└── Run on every PR

Priority 2: WebKit (Safari)
├── Used only in Apple ecosystems (iOS + macOS)
├── Different JavaScript engine
└── Run after Chromium passes

Priority 3: Firefox
├── little used in the market
├── Different rendering engine (Gecko)
└── Run after Chromium passes

```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application URL | `https://www.saucedemo.com` |
| `STANDARD_USER` | Default test user | `standard_user` |
| `STANDARD_PASSWORD` | Default password | `secret_sauce` |
| `DEFAULT_TIMEOUT` | Action timeout (ms) | `30000` |
| `HEADLESS` | Run without browser UI | `true` |
| `RETRY_COUNT` | Test retry attempts | `2` |

### Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
{
  // Parallel execution
  fullyParallel: true,

  // CI-specific settings
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Screenshot on every test
  screenshot: 'on',

  // Video on first retry
  video: 'on-first-retry',

  // Trace for debugging
  trace: 'on-first-retry',
}
```

## Autor

- Carlos Jaramillo
- [+573164064669](+573164064669)
- [carlos.jaramillog@gmail.com](mailto:carlos.jaramillog@gmail.com)
