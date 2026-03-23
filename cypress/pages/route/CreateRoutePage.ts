import { BasePage } from '../base/BasePage';

/**
 * CreateRoutePage - Page Object for creating a new Route
 */
export class CreateRoutePage extends BasePage {
  // Selectors
  readonly selectors = {
    // Route Configuration Type
    basicRadio: '[data-testid="route-form-config-type-basic"]',
    advancedRadio: '[data-testid="route-form-config-type-advanced"]',
    
    // Form fields
    routeNameInput: '[data-testid="route-form-name"]',
    methodsDivTrigger: '[data-testid="multiselect-trigger"]',
    hostsInput: '[data-testid*="route-form-hosts-input"]',
    pathsInput: '[data-testid*="route-form-paths-input"]',
    
    // Buttons
    saveButton: '[data-testid="route-create-form-submit"]',
    cancelButton: '[data-testid="route-create-form-cancel"]',
    
    // Success notification
    successNotification: '.toaster-message',
    
    // Error notification
    formError: '[data-testid="form-error"] div p',
  };

  constructor() {
    super('/default/routes/create');
  }

  /**
   * Verify on Create Route page
   */
  verifyOnCreateRoutePage(): void {
    cy.url().should('include', '/routes/create');
    cy.contains('Create Route').should('be.visible');
  }

  /**
   * Select Basic route configuration
   */
  selectBasicConfiguration(): void {
    cy.get(this.selectors.basicRadio).check({ force: true });
  }

  /**
   * Select Advanced route configuration
   */
  selectAdvancedConfiguration(): void {
    cy.get(this.selectors.advancedRadio).check({ force: true });
  }

  /**
   * Verify Basic configuration is selected
   */
  verifyBasicSelected(): void {
    cy.get(this.selectors.basicRadio).should('be.checked');
  }

  /**
   * Verify Advanced configuration is selected
   */
  verifyAdvancedSelected(): void {
    cy.get(this.selectors.advancedRadio).should('be.checked');
  }

  /**
   * Generate random route name with format: phoebe-example-route-XXX
   * where XXX is a 3-digit random number (000-999)
   */
  generateRouteName(): string {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `phoebe-example-route-${randomNum}`;
  }

  /**
   * Enter route name
   */
  enterRouteName(name: string): void {
    cy.get(this.selectors.routeNameInput).clear().type(name);
  }

  /**
   * Enter hosts
   */
  enterHosts(hosts: string): void {
    cy.get(this.selectors.hostsInput).clear().type(hosts);
  }

  /**
   * Enter paths
   */
  enterPaths(paths: string): void {
    cy.get(this.selectors.pathsInput).clear().type(paths);
  }

  /**
   * Select methods (e.g., GET, POST)
   */
  selectMethods(methods: string[]): void {
    methods.forEach((method) => {
      // Scroll to dropdown, ensure visible, then open it
      cy.get(this.selectors.methodsDivTrigger)
        .scrollIntoView()
        .should('be.visible')
        .click();
      // Click on the specific method option using data-testid
      cy.get(`[data-testid="multiselect-item-${method}"]`).click();
    });
  }

  /**
   * Click Save button
   */
  clickSave(): void {
    cy.get(this.selectors.saveButton).scrollIntoView()
        .should('be.visible').click();
  }

  /**
   * Click Cancel button
   */
  clickCancel(): void {
    cy.get(this.selectors.cancelButton).click();
  }

  /**
   * Verify toast notification for successful route creation
   * Format: Route "{routeName}" successfully created!
   */
  verifySuccessToastNotification(routeName: string): void {
    cy.get(this.selectors.successNotification)
      .should('be.visible')
      .and('contain', 'Route')
      .and('contain', routeName)
      .and('contain', 'successfully created');
  }

  /**
   * Verify mandatory fields validation
   */
  verifyMandatoryFields(): void {
    // Route name is required
    cy.get(this.selectors.routeNameInput).should('have.attr', 'required');
  }

  /**
   * Verify path validation error
   */
  verifyPathValidationError(): void {
    cy.contains('Path must start with "/"').should('be.visible');
  }

  /**
   * Verify duplicate route name error
   * Error message: UNIQUE violation detected on '{name="routeName"}'
   */
  verifyDuplicateRouteNameError(routeName: string): void {
    cy.get(this.selectors.formError)
      .should('be.visible')
      .and('contain', 'UNIQUE violation detected')
      .and('contain', `name="${routeName}"`);
  }

  /**
   * Check if Save button is disabled
   */
  isSaveButtonDisabled(): Cypress.Chainable<boolean> {
    return cy.get(this.selectors.saveButton).then(($btn) => {
      return $btn.is(':disabled');
    });
  }

  /**
   * Clear all form fields
   */
  clearForm(): void {
    cy.get(this.selectors.routeNameInput).clear();
    cy.get(this.selectors.pathsInput).clear();
    cy.get(this.selectors.hostsInput).clear();
  }

  /**
   * Submit form with Basic configuration
   * @param routeName - Route name (if not provided, generates random name)
   * @param paths - Route paths (default: /api)
   * @param methods - HTTP methods (default: ['GET'])
   */
  submitBasicForm(
    routeName?: string,
    paths?: string,
    methods: string[] = ['GET']
  ): string {
    // Ensure Basic is selected
    this.selectBasicConfiguration();
    this.verifyBasicSelected();

    // Use provided name or generate random
    const name = routeName || this.generateRouteName();
    this.enterRouteName(name);

    // Enter paths
    this.enterPaths(paths);

    // Select methods
    this.selectMethods(methods);

    // Click on body to close the methods dropdown
    cy.get('body').click(0, 0);

    // Submit
    this.clickSave();

    return name;
  }

    /**
   * Submit form with Advanced configuration
   * @param routeName - Route name (if not provided, generates random name)
   * @param paths - Route paths (default: /api)
   * @param methods - HTTP methods (default: ['GET'])
   */
  submitAdvancedForm(
    routeName?: string,
    paths: string = '/api',
    methods: string[] = ['GET']
  ): string {
    // Ensure Advanced is selected
    this.selectAdvancedConfiguration();
    this.verifyAdvancedSelected();

    // Use provided name or generate random
    const name = routeName || this.generateRouteName();
    this.enterRouteName(name);

    // Enter paths
    this.enterPaths(paths);

    // Select methods
    this.selectMethods(methods);

    // Click on body to close the methods dropdown
    cy.get('body').click(0, 0);

    // Submit
    this.clickSave();

    return name;
  }

}
