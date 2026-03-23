import { BasePage } from '../base/BasePage';

/**
 * GatewayServiceFormPage - Page Object for creating a new Gateway Service
 */
export class GatewayServiceFormPage extends BasePage {
  // Selectors
  readonly selectors = {
    // Form sections
    fullUrlRadio: '[data-testid="gateway-service-url-radio"]',
    fullUrlInput: '[data-testid="gateway-service-url-input"]',
    nameInput: '[data-testid="gateway-service-name-input"]',
    
    // Buttons
    saveButton: '[data-testid="service-create-form-submit"]',
    cancelButton: '[data-testid="service-create-form-cancel"]',
    
    // Validation messages
    urlErrorMessage: '.gateway-service-url-input .help-text, .help-text:contains("URL must follow")',
    
    // Success notification
    successNotification: '[data-testid="toast-notification"], .toast-notification',
    
    // Service detail page (after creation)
    enabledValue: '[data-testid="enabled-badge-status"]',
    addRouteButton: '.add-route-btn, button:contains("Add a Route")'
  };

  constructor() {
    super('/default/services/create');
  }

  /**
   * Verify on the New Gateway Service form
   */
  verifyOnForm(): void {
    cy.url().should('include', '/services/create');
    cy.contains('New Gateway Service').should('be.visible');
  }

  /**
   * Enter Full URL value
   */
  enterFullUrl(url: string): void {
    cy.get(this.selectors.fullUrlInput).clear().type(url);
  }

  /**
   * Enter Service Name
   */
  enterServiceName(name: string): void {
    cy.get(this.selectors.nameInput).clear().type(name);
  }

  /**
   * Click Save button
   */
  clickSave(): void {
    cy.get(this.selectors.saveButton).click();
  }

  /**
   * Click Cancel button
   */
  clickCancel(): void {
    cy.get(this.selectors.cancelButton).click();
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
   * Verify URL validation error is shown
   */
  verifyUrlValidationError(): void {
    cy.get(this.selectors.urlErrorMessage)
      .should('be.visible')
      .and('contain', 'valid format');
  }

  /**
   * Check for empty field validation errors
   */
  verifyMandatoryFieldsValidation(): void {
    cy.get(this.selectors.fullUrlInput).should('have.attr', 'required');
  }

  /**
   * Submit the form with given values
   */
  submitForm(fullUrl: string, serviceName: string): void {
    this.enterFullUrl(fullUrl);
    this.enterServiceName(serviceName);
    this.clickSave();
  }

  /**
   * Verify successful creation
   */
  verifySuccessfulCreation(serviceName: string): void {
    // Check URL changed to service detail page
    cy.url().should('match', /\/services\/[a-zA-Z0-9_-]+$/);
    
    // Check success notification
    cy.contains('successfully created').should('be.visible');
    
    // Verify service name on detail page
    cy.contains(serviceName).should('be.visible');
    
    // Verify Enabled status is "Enabled"
    this.verifyEnabledStatus();
    
    // Verify "Add a Route" button is visible
    this.verifyAddRouteButtonVisible();
  }

  /**
   * Verify Enabled status is "Enabled" on service detail page
   */
  verifyEnabledStatus(): void {
    cy.get(this.selectors.enabledValue)
      .should('be.visible')
      .and('contain', 'Enabled');
  }

  /**
   * Verify "Add a Route" button is visible on service detail page
   */
  verifyAddRouteButtonVisible(): void {
    cy.get(this.selectors.addRouteButton)
      .should('be.visible')
      .and('contain', 'Add a Route');
  }

  /**
   * Click "Add a Route" button on service detail page
   */
  clickAddRouteButton(): void {
    cy.get(this.selectors.addRouteButton).click();
  }

  /**
   * Verify toast notification for successful service creation
   * Format: Gateway Service "{serviceName}" successfully created!
   */
  verifySuccessToastNotification(serviceName: string): void {
    // Toast notification appears in bottom-right corner
    cy.get(this.selectors.successNotification)
      .should('be.visible')
      .and('contain', 'Gateway Service')
      .and('contain', serviceName)
      .and('contain', 'successfully created');
  }

  /**
   * Verify service detail page shows correct URL
   * Splits URL into three parts and verifies each part is visible
   * Example: "https://api.kong-air.com/flights" -> "https", "api.kong-air.com", "/flights"
   */
  verifyServiceUrlOnDetailPage(expectedUrl: string): void {
    // Split URL into three parts: protocol, host, path
    const urlParts = expectedUrl.split('/');
    // urlParts[0] = "https:" (empty string before first / if starts with //)
    // urlParts[2] = "api.kong-air.com"
    // urlParts[3] = "flights"
    
    if (expectedUrl.startsWith('https://')) {
      const protocol = 'https';
      const host = expectedUrl.split('/')[2];
      const path = '/' + expectedUrl.split('/').slice(3).join('/');
      
      // Verify each part is visible
      cy.contains(protocol).should('be.visible');
      cy.contains(host).should('be.visible');
      cy.contains(path).should('be.visible');
    } else {
      // Fallback: check the full URL
      cy.contains(expectedUrl).should('be.visible');
    }
  }

  /**
   * Clear all form fields
   */
  clearForm(): void {
    cy.get(this.selectors.fullUrlInput).clear();
    cy.get(this.selectors.nameInput).clear();
  }
}
