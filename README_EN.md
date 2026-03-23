# Kong Manager E2E Test Project

An end-to-end (E2E) automation testing framework based on Cypress for testing Kong Manager's Gateway Services and Routes functionality.

---

## 📁 Project Structure

```
cypress/
├── e2e/                          # Test cases directory
│   └── tests/
│       ├── e2e-workflows/        # End-to-end complete workflow tests
│       │   └── service-and-route.cy.ts
│       ├── gateway-services/     # Gateway Service related tests
│       │   ├── create.cy.ts
│       │   └── navigation.cy.ts
│       └── routes/               # Route related tests
│           ├── create.cy.ts
│           └── navigation.cy.ts
├── pages/                        # Page Object Model (POM)
│   ├── base/
│   │   └── BasePage.ts           # Base class for all Page classes
│   ├── gateway-service/
│   │   ├── GatewayServiceFormPage.ts
│   │   ├── GatewayServicesListPage.ts
│   │   └── index.ts
│   ├── route/
│   │   ├── CreateRoutePage.ts
│   │   ├── RouteManagementPage.ts
│   │   └── index.ts
│   └── workspace/
│       ├── OverviewPage.ts
│       ├── WorkspacesPage.ts
│       └── index.ts
└── support/                      # Test support files
    └── e2e.ts
```

---

## 🏗️ Layer Descriptions

### 1. `cypress/e2e/tests/` - Test Layer
Contains all test cases, organized by functional modules:

| Directory | Description | Example |
|-----------|-------------|---------|
| `e2e-workflows/` | End-to-end complete workflow tests | Create Service → Add Route → Verify Proxy |
| `gateway-services/` | Gateway Service functional tests | Create, Navigate, Form validation |
| `routes/` | Route functional tests | Create Route, Duplicate name validation |

### 2. `cypress/pages/` - Page Object Layer
Encapsulates page elements and operations using the Page Object Model pattern:

| File | Responsibility |
|------|----------------|
| `BasePage.ts` | Provides common methods: `visit()`, `waitForPageLoad()`, `urlShouldContain()`, etc. |
| `*Page.ts` | Each page corresponds to a class, encapsulating selectors and operation methods |
| `index.ts` | Module export file for convenient batch imports |

**Design Principles:**
- Selectors are centrally defined in the `selectors` object
- Operation methods have clear names: `clickXXX()`, `verifyXXX()`, `enterXXX()`
- Return Cypress Chainable for chaining calls

### 3. `cypress/support/` - Support Layer
Contains test auxiliary files:
- `e2e.ts`: Global before/after hooks, custom commands

---

## ➕ How to Add New Files

### Adding a New Page File

1. **Create a file under `cypress/pages/`**
   ```
   cypress/pages/new-module/NewFeaturePage.ts
   ```

2. **Extend BasePage and define selectors**
   ```typescript
   import { BasePage } from '../base/BasePage';

   export class NewFeaturePage extends BasePage {
     readonly selectors = {
       // Prioritize using data-testid
       featureInput: '[data-testid="feature-input"]',
       submitButton: '[data-testid="submit-btn"]',
     };

     constructor() {
       super('http://localhost:8002/default/feature');
     }

     // Operation methods
     enterFeatureName(name: string): void {
       cy.get(this.selectors.featureInput).clear().type(name);
     }

     clickSubmit(): void {
       cy.get(this.selectors.submitButton).click();
     }
   }
   ```

3. **Export in `index.ts`**
   ```typescript
   // cypress/pages/new-module/index.ts
   export { NewFeaturePage } from './NewFeaturePage';
   ```

4. **Register the module in `cypress/pages/index.ts`**
   ```typescript
   export * from './new-module';
   ```

### Adding a New Test File

1. **Create a `.cy.ts` file in the appropriate directory**
   ```
   cypress/e2e/tests/new-module/feature.cy.ts
   ```

2. **Write the test structure**
   ```typescript
   import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
   import { NewFeaturePage } from '../../../pages/new-module/NewFeaturePage';

   describe('New Feature Tests', () => {
     const workspacesPage = new WorkspacesPage();
     const newFeaturePage = new NewFeaturePage();

     beforeEach(() => {
       workspacesPage.navigateToWorkspaces();
       workspacesPage.clickDefaultRow();
     });

     it('should test something', () => {
       // Test steps
       newFeaturePage.enterFeatureName('test');
       newFeaturePage.clickSubmit();
       
       // Assertions
       cy.contains('Success').should('be.visible');
     });
   });
   ```

3. **Register in `cypress.config.ts` (if needed)**
   ```typescript
   specPattern: [
     "cypress/e2e/tests/gateway-services/**/*.cy.ts",
     "cypress/e2e/tests/routes/**/*.cy.ts",
     "cypress/e2e/tests/new-module/**/*.cy.ts",  // Add new line
   ],
   ```

---

## 🚀 How to Run Tests

### 1. Open Cypress Test Runner (Recommended for development)
```bash
npx cypress open
```
- Visually select and run tests
- Supports debugging and viewing real-time execution

### 2. Run all tests in command line
```bash
npx cypress run
```

### 3. Run specific test file
```bash
npx cypress run --spec "cypress/e2e/tests/routes/create.cy.ts"
```

### 4. Run tests in specific directory
```bash
npx cypress run --spec "cypress/e2e/tests/routes/**/*.cy.ts"
```

### 5. Run with specific browser
```bash
npx cypress run --browser chrome
npx cypress run --browser edge
```

### 6. Headless mode (for CI/CD)
```bash
npx cypress run --headless
```

### 7. Run specific tests (using grep)
```bash
# Run tests containing "create"
npx cypress run --env grep="create"
```

---

## 📝 Best Practices for Writing Tests

### 1. Selector Standards
- **Prioritize using `data-testid`**: Stable and less likely to break due to UI changes
  ```typescript
  // ✅ Recommended
  myInput: '[data-testid="route-form-name"]'
  
  // ❌ Not recommended
  myInput: '.form-control input[type="text"]'
  ```

### 2. Waiting Strategies
- Use Cypress's automatic waiting mechanism
- Add explicit waits when necessary:
  ```typescript
  cy.wait(500);  // Wait for page transition
  cy.get('[data-testid="element"]', { timeout: 10000 }).should('be.visible');
  ```

### 3. Conditional Testing
- Use `.then()` to handle asynchronous results
  ```typescript
  gatewayServicesList.hasEnabledService().then((hasEnabled) => {
    if (hasEnabled) {
      // Perform actions
    } else {
      cy.log('No enabled services found');
    }
  });
  ```

### 4. Generating Random Data
- Use the random data generation method provided by the Page class
  ```typescript
  const routeName = createRoutePage.generateRouteName();
  // Result: phoebe-example-route-XXX
  ```

### 5. Skipping Unstable Tests
- Use `it.skip()` to temporarily skip
- Use `it.only()` to run only specific tests

---

## ⚙️ Configuration

### Cypress Configuration (`cypress.config.ts`)

| Config Item | Description | Current Value |
|-------------|-------------|---------------|
| `baseUrl` | Base URL for tests | `http://localhost:8002` |
| `viewportWidth` | Viewport width | `1280` |
| `viewportHeight` | Viewport height | `720` |
| `video` | Record video | `true` |
| `screenshotOnRunFailure` | Screenshot on failure | `true` |
| `specPattern` | Test file patterns | See config file |

### TypeScript Configuration
- Project uses TypeScript
- Type check before running: `npx tsc --noEmit`

---

## 🔧 Environment Requirements

- **Node.js**: >= 16.x
- **Cypress**: ^15.12.0
- **TypeScript**: ^5.9.3

### Install Dependencies
```bash
npm install
```

---

## 📊 Test Reports

### Videos and Screenshots
- **Videos**: Saved in `cypress/videos/`
- **Failure Screenshots**: Automatically saved in `cypress/screenshots/`

### View Results
```bash
# After running tests
ls cypress/videos/
ls cypress/screenshots/
```

---

## 🐛 Common Issues

### 1. Element not found
- Check if `data-testid` is correct
- Add appropriate wait time
- Use `{ timeout: 10000 }` to increase timeout

### 2. Unstable tests
- Ensure the page is fully loaded before operating
- Use `cy.wait()` to wait for API responses
- Avoid hard-coded wait times, prefer Cypress's automatic waiting

### 3. Type check errors
```bash
# Run type check
npx tsc --noEmit
```

---

## 📚 Reference Resources

- [Cypress Official Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

---

## 🎯 Project Maintenance

- Regularly clean up unused code
- Keep Page class selectors updated
- Fix deprecated test cases in a timely manner
