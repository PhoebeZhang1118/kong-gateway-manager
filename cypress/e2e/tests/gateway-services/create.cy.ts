import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { OverviewPage } from '../../../pages/workspace/OverviewPage';
import { GatewayServiceFormPage } from '../../../pages/gateway-service/GatewayServiceFormPage';
import { GatewayServicesListPage } from '../../../pages/gateway-service/GatewayServicesListPage';

/**
 * Gateway Service Creation Tests
 * Tests for creating new gateway services with various scenarios
 */
describe('Gateway Service Creation', () => {
  const workspacesPage = new WorkspacesPage();
  const overviewPage = new OverviewPage();
  const gatewayServicesList = new GatewayServicesListPage();
  const gatewayServiceForm = new GatewayServiceFormPage();

  beforeEach(() => {
    workspacesPage.navigateToWorkspaces();
    workspacesPage.clickDefaultRow();
    // Navigate to Gateway Services and click New gateway service button
    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
    gatewayServicesList.clickNewGatewayServiceButton();
    gatewayServiceForm.verifyOnForm();
  });

  describe('Full URL Validation Scenarios', () => {
    beforeEach(() => {
      // Switch to Full URL option
     gatewayServiceForm.clickFullUrlRadio();
    });
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

  describe('Protocol, Host, Port, and Path Validation Scenarios', () => {
    beforeEach(() => {
      // Switch to Protocol, host, port, and path option
      gatewayServiceForm.clickProtocolRadio();
    });

    it('should validate Protocol and Host are required fields', () => {
      gatewayServiceForm.verifyProtocolHostRequiredFields();
    });

    it('should disable Save button when Protocol/Host fields are empty', () => {
      gatewayServiceForm.clearProtocolHostPathPortForm();
      gatewayServiceForm.isSaveButtonDisabled().should('be.true');
    });

    it('should show validation error when Host contains /', () => {
      gatewayServiceForm.enterHost('test/api');
      cy.get(gatewayServiceForm.selectors.hostInput).blur();
      gatewayServiceForm.verifyHostValidationError();
    });

    it('should show validation error when Path does not start with /', () => {
      gatewayServiceForm.enterHost('localhost');
      gatewayServiceForm.enterPath('api');
      cy.get(gatewayServiceForm.selectors.pathInput).blur();
      gatewayServiceForm.verifyPathValidationError();
    });

    it('should disable Save button when there are validation errors', () => {
      // Enter invalid host with /
      gatewayServiceForm.enterHost('test/api');
      cy.get(gatewayServiceForm.selectors.hostInput).blur();
      gatewayServiceForm.verifyHostValidationError();
      
      // Save button should be disabled
      gatewayServiceForm.isSaveButtonDisabled().should('be.true');
    });

    it('should disable Save button when Path validation fails', () => {
      gatewayServiceForm.enterHost('localhost');
      gatewayServiceForm.enterPath('invalid-path');
      cy.get(gatewayServiceForm.selectors.pathInput).blur();
      gatewayServiceForm.verifyPathValidationError();
      
      // Save button should be disabled
      gatewayServiceForm.isSaveButtonDisabled().should('be.true');
    });
  });

  describe('Happy Path - Create Gateway Service', () => {
    it('should successfully create a Full URL gateway service with valid data', () => {
      const testUrl = 'https://api.kong-air.com/flights';
      
      gatewayServiceForm.clickFullUrlRadio();
      
      // Submit form using the auto-generated default service name
      gatewayServiceForm.submitFormWithFullUrlAndDefaultName(testUrl).then((defaultServiceName) => {
        // Verify toast notification with the default service name
        gatewayServiceForm.verifySuccessToastNotification(defaultServiceName);
        
        // Verify successful creation
        gatewayServiceForm.verifySuccessfulCreation(defaultServiceName);
        
        // Verify URL parts are displayed correctly
        gatewayServiceForm.verifyServiceUrlOnDetailPage(testUrl);
      });
    });

    it('should successfully create a gateway service using Protocol, host, port, and path option', () => {
      // Test data - can be parameterized for different scenarios
      const serviceConfig = {
        protocol: 'http',
        host: 'localhost',
        path: '/workspaces',
        port: '8002'
      };

      // Submit form using the auto-generated default service name
      gatewayServiceForm.submitFormWithProtocolHostPortPathAndDefaultName(
        serviceConfig.protocol,
        serviceConfig.host,
        serviceConfig.path,
        serviceConfig.port
      ).then((defaultServiceName) => {
        // Verify toast notification with the default service name
        gatewayServiceForm.verifySuccessToastNotification(defaultServiceName);
        
        // Verify successful creation
        gatewayServiceForm.verifySuccessfulCreation(defaultServiceName);
        
        // Verify endpoint details are displayed correctly
        gatewayServiceForm.verifyServiceEndpointOnDetailPage(
          serviceConfig.protocol,
          serviceConfig.host,
          serviceConfig.path,
          serviceConfig.port
        );
      });
    });
  });

  describe('Form Navigation', () => {
    it('should navigate back when clicking Cancel', () => {
      gatewayServiceForm.clickCancel();
      gatewayServicesList.verifyOnGatewayServicesPage();
    });
  });
});
