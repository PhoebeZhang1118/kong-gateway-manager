/**
 * BasePage - Base class for all page objects
 * Contains common methods used across all pages
 */
export abstract class BasePage {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Navigate to the page URL
   */
  visit(): void {
    cy.visit(this.url);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  /**
   * Wait for the page to load by checking if app mount exists
   */
  waitForPageLoad(): void {
    cy.get('#app-mount', { timeout: 10000 }).should('not.be.empty');
  }

  /**
   * Check if URL contains specific path
   */
  urlShouldContain(path: string): void {
    cy.url().should('include', path);
  }
}
