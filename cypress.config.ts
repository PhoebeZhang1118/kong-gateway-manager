import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    // Point to the tests directory
    specPattern: [
      "cypress/e2e/tests/gateway-services/**/*.cy.ts",
      "cypress/e2e/tests/routes/**/*.cy.ts",
      "cypress/e2e/tests/e2e-workflows/**/*.cy.ts"
    ],
    
    // Support file location
    supportFile: "cypress/support/e2e.ts",
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    // Base URL for all tests
    baseUrl: "http://localhost:8002",
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
  },
});
