import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { OverviewPage } from '../../../pages/workspace/OverviewPage';
import { GatewayServiceFormPage } from '../../../pages/gateway-service/GatewayServiceFormPage';

/**
 * Gateway Service Creation Tests
 * Tests for creating new gateway services with various scenarios
 */
describe('Gateway Service Creation', () => {
  const workspacesPage = new WorkspacesPage();
  const overviewPage = new OverviewPage();
  const gatewayServiceForm = new GatewayServiceFormPage();

  const testUrl = 'https://api.kong-air.com/flights';
  const testServiceName = 'phoebe-example-service';

  beforeEach(() => {
    workspacesPage.navigateToWorkspaces();
    workspacesPage.clickDefaultRow();
    overviewPage.verifyOnOverviewPage();
    
    // Only proceed if Services count is 0
    overviewPage.getServicesCount().then((count) => {
      if (count === 0) {
        overviewPage.clickAddGatewayService();
        gatewayServiceForm.verifyOnForm();
      } else {
        cy.log(`Services count is ${count}, skipping service creation`);
        cy.wrap(null).as('skipTest');
      }
    });
  });

  describe('Validation Scenarios', () => {
    it('should validate mandatory fields are required', () => {
      gatewayServiceForm.verifyMandatoryFieldsValidation();
    });

    it('should disable Save button when mandatory fields are empty', () => {
      gatewayServiceForm.clearForm();
      gatewayServiceForm.isSaveButtonDisabled().should('be.true');
    });

    it('should show validation error for invalid URL format', () => {
      gatewayServiceForm.enterFullUrl('invalid-url');
      cy.get('[data-testid="gateway-service-url-input"]').blur();
      gatewayServiceForm.verifyUrlValidationError();
    });
    it('should validate URL format when entering partial URL', () => {
      gatewayServiceForm.enterFullUrl('api.kong-air.com/flights');
      cy.get('[data-testid="gateway-service-url-input"]').blur();
      gatewayServiceForm.verifyUrlValidationError();
    });
  });

  describe('Happy Path - Create Gateway Service', () => {
    it('should successfully create a gateway service with valid data', () => {
      gatewayServiceForm.submitForm(testUrl, testServiceName);
      
      // Verify toast notification
      gatewayServiceForm.verifySuccessToastNotification(testServiceName);
      
      // Verify successful creation
      gatewayServiceForm.verifySuccessfulCreation(testServiceName);
      
      // Verify URL parts are displayed correctly
      gatewayServiceForm.verifyServiceUrlOnDetailPage(testUrl);
    });
  });

  describe('Form Navigation', () => {
    it('should navigate back when clicking Cancel', () => {
      gatewayServiceForm.clickCancel();
      overviewPage.verifyOnOverviewPage();
    });
  });
});
