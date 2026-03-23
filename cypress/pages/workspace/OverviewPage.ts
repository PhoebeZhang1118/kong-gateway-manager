import { BasePage } from '../base/BasePage';

/**
 * OverviewPage - Page Object for the Workspace Overview page
 */
export class OverviewPage extends BasePage {
  // Selectors
  readonly selectors = {
    // Services count in summary section
    servicesCountValue: '[data-testid="Services"] .metric-value-text',
    
    // Buttons
    addGatewayServiceButton: '[data-testid="action-button"], button:contains("Add a Gateway Service")',
  };

  constructor() {
    super('/default/overview');
  }

  /**
   * Navigate to overview page directly
   */
  navigateToOverview(): void {
    this.visit();
    this.waitForPageLoad();
  }

  /**
   * Get the Services count from the summary section
   * Returns the number displayed in the Services card
   */
  getServicesCount(): Cypress.Chainable<number> {
    // Get the Services metric value from the specific selector
    return cy.get(this.selectors.servicesCountValue)
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
  }

  /**
   * Click "Add a Gateway Service" button
   */
  clickAddGatewayService(): void {
    cy.contains('button', 'Add a Gateway Service').click();
  }

  /**
   * Verify on overview page by checking URL
   */
  verifyOnOverviewPage(): void {
    cy.url().should('include', '/overview');
  }

  /**
   * Verify page loaded correctly with all expected elements
   */
  verifyPageLoaded(): void {
    this.verifyOnOverviewPage();
    cy.get('#app-mount', { timeout: 10000 }).should('not.be.empty');
    cy.contains('Overview').should('be.visible');
  }
}
