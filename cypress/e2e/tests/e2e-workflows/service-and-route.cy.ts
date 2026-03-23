import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { OverviewPage } from '../../../pages/workspace/OverviewPage';
import { GatewayServiceFormPage } from '../../../pages/gateway-service/GatewayServiceFormPage';
import { GatewayServicesListPage } from '../../../pages/gateway-service/GatewayServicesListPage';
import { RouteManagementPage } from '../../../pages/route/RouteManagementPage';
import { CreateRoutePage } from '../../../pages/route/CreateRoutePage';

/**
 * End-to-End Workflow Tests
 * Complete flow: Create Gateway Service -> Add Route -> Verify routing
 */
describe('E2E Workflow: Create Service and Route', () => {
  const workspacesPage = new WorkspacesPage();
  const overviewPage = new OverviewPage();
  const gatewayServiceForm = new GatewayServiceFormPage();
  const gatewayServicesList = new GatewayServicesListPage();
  const routeManagement = new RouteManagementPage();
  const createRoutePage = new CreateRoutePage();

  const serviceUrl = 'https://api.kong-air.com/flights';
  const serviceName = 'e2e-test-service';
  const routeName = createRoutePage.generateRouteName();
  const routePath = '/flights';

  it('should complete full workflow: create service, add route, and verify', () => {
    // Step 1: Navigate to workspaces
    workspacesPage.navigateToWorkspaces();
    workspacesPage.verifyPageLoaded();

    // Step 2: Click default row and go to overview
    workspacesPage.clickDefaultRow();
    cy.wait(1000);
    overviewPage.verifyOnOverviewPage();

    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
    cy.wait(500);

    // Step 3: Check if we need to create a service
    gatewayServicesList.hasEnabledService().then((hasEnabled) => {
      if (hasEnabled) {
        gatewayServicesList.clickFirstEnabledService();
        cy.contains('Enabled').should('be.visible');
      } else {
         // Step 3: Create new gateway service
        overviewPage.clickAddGatewayService();
        gatewayServiceForm.verifyOnForm();

        gatewayServiceForm.submitForm(serviceUrl, serviceName);
        gatewayServiceForm.verifySuccessToastNotification(serviceName);
        gatewayServiceForm.verifySuccessfulCreation(serviceName);
      }
    });
      // Step 4: Click on Routes tab
      routeManagement.clickRoutesTab();
      routeManagement.verifyOnRoutesSection();
      // Step 5: Add a new route
      routeManagement.clickNewRouteButton();
      createRoutePage.verifyOnCreateRoutePage();
      createRoutePage.submitBasicForm(routeName,routePath);
      createRoutePage.verifySuccessToastNotification(routeName);
  });

  it('should verify route proxies requests correctly', () => {
    // This test would make an actual HTTP request to the Kong Gateway
    // verify that the route correctly proxies to the upstream service
    cy.request({
      method: 'GET',
      url: 'http://localhost:8000' + routePath,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200]);
    });

    cy.log('Route proxy verification - requires running Kong Gateway');
  });
});
