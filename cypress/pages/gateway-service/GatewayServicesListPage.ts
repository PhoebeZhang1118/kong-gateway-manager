import { BasePage } from '../base/BasePage';

/**
 * GatewayServicesListPage - Page Object for the Gateway Services list page
 */
export class GatewayServicesListPage extends BasePage {
  // Selectors
  readonly selectors = {
    // Sidebar navigation
    sidebarGatewayServicesMenu: '[data-testid="sidebar-item-gateway-services"] a.sidebar-item-link',
    
    // Service items
    serviceNameLink: '[data-testid*="name"] a, .service-name-link',
    
    // New service button
    newGatewayServiceButton: 'button:contains("New gateway service"), [data-testid="new-gateway-service-btn"]',
  };

  constructor() {
    super('/default/services');
  }

  /**
   * Navigate to Gateway Services list page
   */
  navigateToGatewayServices(): void {
    // Click on Gateway Services in left sidebar using data-testid
    cy.get(this.selectors.sidebarGatewayServicesMenu).click();
    this.waitForPageLoad();
  }

  /**
   * Verify on Gateway Services list page
   */
  verifyOnGatewayServicesPage(): void {
    cy.url().should('include', '/services');
    cy.contains('Gateway Services').should('be.visible');
  }

  /**
   * Check if there's at least one enabled service
   * An enabled service has a switch control with:
   * - class containing 'checked'
   * - aria-checked="true"
   */
  hasEnabledService(): Cypress.Chainable<boolean> {
    // Wait for the table to be visible first
    cy.get('table', { timeout: 10000 }).should('be.visible');
    
    return cy.get('body', { timeout: 10000 }).then(($body) => {
      // First, log all switch controls found for debugging
      const allSwitches = $body.find('[data-testid="switch-control"]');
      
      // Find switch controls that are checked (enabled)
      const enabledSwitches = allSwitches.filter(function() {
        const $switch = $body.find(this);
        const hasCheckedClass = $switch.hasClass('checked');
        const isAriaChecked = $switch.attr('aria-checked') === 'true';
        
        return hasCheckedClass && isAriaChecked;
      });
      
      return enabledSwitches.length > 0;
    });
  }

  /**
   * Click on the first enabled service
   */
  clickFirstEnabledService(): Cypress.Chainable<string> {
    return cy.get('tbody tr').first().then(($row) => {
      // Get the service name from the row
      const serviceName = $row.find('[data-testid*="name"]').text().trim();
      // Click on the service name/link
      cy.wrap($row).find('td').first().click();
      return cy.wrap(serviceName);
    });
  }

  /**
   * Click New gateway service button
   */
  clickNewGatewayService(): void {
    cy.contains('button', 'New gateway service').click();
  }
}
