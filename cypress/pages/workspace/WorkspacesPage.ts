import { BasePage } from '../base/BasePage';

/**
 * WorkspacesPage - Page Object for the Workspaces page
 */
export class WorkspacesPage extends BasePage {
  constructor() {
    super('/workspaces');
  }

  /**
   * Navigate to workspaces page
   */
  navigateToWorkspaces(): void {
    this.visit();
    this.waitForPageLoad();
  }

  /**
   * Click on the [default] workspace row
   */
  clickDefaultRow(): void {
    cy.get('[data-testid="workspace-link-default"]')
      .should('exist')
      .click();
  }

  /**
   * Verify page loaded correctly
   */
  verifyPageLoaded(): void {
    this.urlShouldContain('/workspaces');
    cy.get('#app-mount', { timeout: 10000 }).should('not.be.empty');
  }
}
