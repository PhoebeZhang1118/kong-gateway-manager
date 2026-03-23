# Test Structure

## Directory Organization

```
cypress/e2e/tests/
├── gateway-services/       # Gateway Service related tests
│   ├── navigation.cy.ts    # Navigation to service pages
│   ├── create.cy.ts        # Create service scenarios
│   └── update-delete.cy.ts # Update and delete operations
├── routes/                 # Route related tests
│   ├── navigation.cy.ts    # Navigation to create route
│   ├── create.cy.ts        # Create route scenarios
│   └── update-delete.cy.ts # Update and delete operations
├── e2e-workflows/          # End-to-end complete workflows
│   └── service-and-route.cy.ts  # Full workflow tests
└── README.md               # This file
```

## Test Categories

### 1. Gateway Services (`gateway-services/`)
- **Navigation**: Different ways to navigate to gateway service pages
- **Create**: Validation and happy path for creating services
- **Update/Delete**: Modify and remove services

### 2. Routes (`routes/`)
- **Navigation**: Different entry points to add routes
- **Create**: Validation and happy path for creating routes
- **Update/Delete**: Modify and remove routes

### 3. E2E Workflows (`e2e-workflows/`)
- Complete user journeys
- Integration tests

## Running Tests

```bash
# Run all tests
npx cypress run

# Run specific category
npx cypress run --spec "cypress/e2e/tests/gateway-services/**/*.cy.ts"
npx cypress run --spec "cypress/e2e/tests/routes/**/*.cy.ts"
npx cypress run --spec "cypress/e2e/tests/e2e-workflows/**/*.cy.ts"

# Run specific test file
npx cypress run --spec "cypress/e2e/tests/gateway-services/create.cy.ts"

# Run with grep (test name filter)
npx cypress run --env grep="Create Gateway Service"
```

## Project Goals

1. ✅ Navigate to Gateway Service from different entry points
2. ✅ Create Gateway Service with validation
3. ✅ Navigate to Create Route from different entry points
4. 🔄 Create Route with validation (WIP)
5. 🔄 E2E: Service → Route → Verify Proxy (WIP)
6. 🔄 Update/Delete operations (WIP)
