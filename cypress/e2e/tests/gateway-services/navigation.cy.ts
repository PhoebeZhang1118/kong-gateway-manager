import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { OverviewPage } from '../../../pages/workspace/OverviewPage';
import { GatewayServicesListPage } from '../../../pages/gateway-service/GatewayServicesListPage';
import { GatewayServiceFormPage } from '../../../pages/gateway-service/GatewayServiceFormPage';

/**
 * Gateway Service Navigation Tests
 * Tests for navigating to Gateway Service from different entry points
 */
describe('Gateway Service Navigation', () => {
  const workspacesPage = new WorkspacesPage();
  const overviewPage = new OverviewPage();
  const gatewayServicesList = new GatewayServicesListPage();
  const gatewayServiceForm = new GatewayServiceFormPage();

  beforeEach(() => {
    workspacesPage.navigateToWorkspaces();
  });

  it('should navigate via [default] workspace row and create service from overview', () => {
    workspacesPage.clickDefaultRow();
    overviewPage.verifyOnOverviewPage();
    
    // Check Services count and conditionally show button
    overviewPage.getServicesCount().then((count) => {
      if (count === 0) {
        overviewPage.clickAddGatewayService();
        gatewayServiceForm.verifyOnForm();
      }
    });
  });

  it('should navigate via Gateway Services menu in sidebar', () => {
    workspacesPage.clickDefaultRow();
    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
  });

  it('should click on existing service from Gateway Services list', () => {
    workspacesPage.clickDefaultRow();
    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
    
    gatewayServicesList.hasEnabledService().then((hasEnabled) => {
      if (hasEnabled) {
        gatewayServicesList.clickFirstEnabledService();
        cy.contains('Enabled').should('be.visible');
        // Verify "Add a Route" button is visible
        cy.get('.add-route-btn, button:contains("Add a Route")')
          .should('be.visible')
          .and('contain', 'Add a Route');
      }
    });
  });
});
