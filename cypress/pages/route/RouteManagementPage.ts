import { BasePage } from '../base/BasePage';

/**
 * RouteManagementPage - Page Object for Route management within Service Detail
 * Handles: Routes tab, Create Route, Route list, Route actions
 */
export class RouteManagementPage extends BasePage {
  // Selectors
  readonly selectors = {
    // Routes tab
    routesTab: '[data-testid="service-routes"], #service-routes',
    
    // Route buttons in service detail
    addRouteButtonTop: '.add-route-btn, button:contains("Add a Route")',
    newRouteButton: '[data-testid="empty-state-action"],[data-testid="toolbar-add-route"]',
    
    // Empty state
    emptyState: '[data-testid="table-empty-state"]',
  };

  constructor() {
    super('/default/services');
  }

  // ==================== Navigation ====================

  /**
   * Click on Routes tab in service detail page
   */
  clickRoutesTab(): void {
    cy.get(this.selectors.routesTab).click();
  }

  /**
   * Verify on Routes section of service detail page
   */
  verifyOnRoutesSection(): void {
    cy.get(this.selectors.routesTab).should('have.class', 'vtab-nav-item-active');
    cy.contains('Routes').should('be.visible');
  }

  // ==================== Button Verification ====================

  /**
   * Verify both [New route] and [Add a Route] buttons are visible
   */
  verifyBothRouteButtonsVisible(): void {
    cy.get(this.selectors.addRouteButtonTop)
      .should('be.visible')
      .and('contain', 'Add a Route');
    cy.get(this.selectors.newRouteButton)
      .scrollIntoView()
      .should('be.visible')
      .and('contain', 'New route');
  }

  // ==================== Button Actions ====================

  /**
   * Click [Add a Route] button (top right)
   */
  clickAddRouteButton(): void {
    cy.get(this.selectors.addRouteButtonTop).click();
  }

  /**
   * Click [New route] button (in empty state)
   */
  clickNewRouteButton(): void {
    cy.get(this.selectors.newRouteButton).click();
  }

  // ==================== Route List ====================

  /**
   * Check if route list is empty
   */
  isRouteListEmpty(): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => {
      return $body.find(this.selectors.emptyState).length > 0;
    });
  }

  /**
   * Get the first route name from the list
   */
  getFirstRouteName(): Cypress.Chainable<string> {
    return cy.get('tbody tr').first().then(($row) => {
      const routeName = $row.attr('data-testid');
      return routeName || '';
    });
  }

  // ==================== Route Verification ====================

  /**
   * Verify route exists in the list
   */
  verifyRouteExists(routeName: string): void {
    cy.get(`[data-testid="${routeName}"]`).should('be.visible');
  }
}
