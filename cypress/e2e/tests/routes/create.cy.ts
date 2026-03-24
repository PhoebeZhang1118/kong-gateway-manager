import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { GatewayServicesListPage } from '../../../pages/gateway-service/GatewayServicesListPage';
import { RouteManagementPage } from '../../../pages/route/RouteManagementPage';
import { CreateRoutePage } from '../../../pages/route/CreateRoutePage';

/**
 * Route Creation Tests
 * Tests for creating new routes with validation and happy path scenarios
 */
describe('Route Creation', () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicesList = new GatewayServicesListPage();
  const routeManagement = new RouteManagementPage();
  const createRoutePage = new CreateRoutePage();

  // Shared setup: navigate to Gateway Services list
  beforeEach(() => {
    workspacesPage.navigateToWorkspaces();
    workspacesPage.clickDefaultRow();
    cy.wait(500);
    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
    cy.wait(500);
  });

  describe('Duplicate Route Name Validation', () => {
    beforeEach(() => {
      // Navigate to an enabled service's Routes tab (without clicking New route)
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          routeManagement.clickRoutesTab();
          routeManagement.verifyOnRoutesSection();
          // Note: Not clicking New route button here, will do it after getting existing route name
        } else {
          cy.log('No enabled services found');
        }
      });
    });

    it('should show error when creating route with duplicate name', () => {
      // Check if there are existing routes
      routeManagement.isRouteListEmpty().then((isEmpty) => {
        if (!isEmpty) {
          // Get the first existing route name
          routeManagement.getFirstRouteName().then((existingRouteName) => {
            cy.log(`Found existing route: ${existingRouteName}`);
            
            // Click New route button
            routeManagement.clickNewRouteButton();
            createRoutePage.verifyOnCreateRoutePage();
            
            // Enter the existing route name (duplicate)
            createRoutePage.enterRouteName(existingRouteName);
            
            // Enter method and path
            createRoutePage.selectMethods(['GET']);
            createRoutePage.enterPaths('/api');
            
            // Click Save
            createRoutePage.clickSave();
            
            // Verify error message for duplicate route name
            createRoutePage.verifyDuplicateRouteNameError(existingRouteName);
            cy.log('✓ Duplicate route name error verified');
          });
        } else {
          cy.log('No existing routes found, skipping duplicate name test');
        }
      });
    });
  });

  describe('Create Route Form Tests', () => {
    beforeEach(() => {
      // Navigate to an enabled service's Routes tab and click New route
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          routeManagement.clickRoutesTab();
          routeManagement.verifyOnRoutesSection();
          routeManagement.clickNewRouteButton();
          createRoutePage.verifyOnCreateRoutePage();
        } else {
          cy.log('No enabled services found');
        }
      });
    });

    describe('Configuration Type Selection', () => {
      it.skip('should select Basic configuration by default', () => {
        createRoutePage.verifyBasicSelected();
      });

      it.skip('should switch between Basic and Advanced configuration', () => {
        // Switch to Advanced
        createRoutePage.selectAdvancedConfiguration();
        createRoutePage.verifyAdvancedSelected();

        // Switch back to Basic
        createRoutePage.selectBasicConfiguration();
        createRoutePage.verifyBasicSelected();
      });
    });

    describe('Validation Scenarios', () => {
      it('should disable Save button when form is incomplete', () => {
        createRoutePage.clearForm();
        createRoutePage.isSaveButtonDisabled().should('be.true');
      });
    });

  describe('Happy Path - Create Route with Basic Configuration', () => {
    it('should successfully create a route using Basic configuration', () => {
      // Generate random route name: phoebe-example-route-XXX
      const routeName = createRoutePage.generateRouteName();
      const routePath = '/api';

      cy.log(`Creating route with name: ${routeName}`);

      // Submit form with Basic configuration
      createRoutePage.submitBasicForm(routeName, routePath, ['GET']);

      // Verify toast notification: Route "{routeName}" successfully created!
      createRoutePage.verifySuccessToastNotification(routeName);

      // Navigate back to Routes tab to verify route is listed
      routeManagement.clickRoutesTab();
      routeManagement.verifyOnRoutesSection();
      
      // Verify the new route exists in the list
      routeManagement.verifyRouteExists(routeName);

      cy.log(`✓ Route "${routeName}" successfully created and verified`);
    });

    it.skip('should create route with multiple methods', () => {
      const routeName = createRoutePage.generateRouteName();

      // Create route with GET and POST methods
      createRoutePage.submitBasicForm(routeName, '/api', ['GET', 'POST']);

      // Verify creation success
      createRoutePage.verifySuccessToastNotification(routeName);

      // Verify on Routes tab
      routeManagement.clickRoutesTab();
      routeManagement.verifyRouteExists(routeName);

      cy.log(`✓ Route "${routeName}" created with GET and POST methods`);
    });
  });

  describe('Happy Path - Create Route with Advanced Configuration', () => {
    it('should successfully create a route using Advanced configuration', () => {
      // Generate random route name: phoebe-example-route-XXX
      const routeName = createRoutePage.generateRouteName();
      const routePath = '/api';

      cy.log(`Creating route with name: ${routeName}`);

      // Submit form with Advanced configuration
      createRoutePage.submitAdvancedForm(routeName, routePath, ['GET']);

      // Verify toast notification: Route "{routeName}" successfully created!
      createRoutePage.verifySuccessToastNotification(routeName);

      // Navigate back to Routes tab to verify route is listed
      routeManagement.clickRoutesTab();
      routeManagement.verifyOnRoutesSection();
      
      // Verify the new route exists in the list
      routeManagement.verifyRouteExists(routeName);

      cy.log(`✓ Route "${routeName}" successfully created and verified`);
    });

    it.skip('should create route with multiple methods', () => {
      const routeName = createRoutePage.generateRouteName();

      // Create route with GET and POST methods
      createRoutePage.submitBasicForm(routeName, '/api', ['GET', 'POST']);

      // Verify creation success
      createRoutePage.verifySuccessToastNotification(routeName);

      // Verify on Routes tab
      routeManagement.clickRoutesTab();
      routeManagement.verifyRouteExists(routeName);

      cy.log(`✓ Route "${routeName}" created with GET and POST methods`);
    });
  });

  describe('Form Navigation', () => {
    it('should return to Routes tab when clicking Cancel', () => {
      // Click Cancel
      createRoutePage.clickCancel();

      // Verify returned to Gateway Service Routes tab
      cy.url().should('include', '/services/');
      cy.url().should('include', '/routes');
      routeManagement.verifyOnRoutesSection();
    });

    it('should return to service detail Routes tab when clicking Cancel after filling form', () => {
      // Fill some form data
      const routeName = createRoutePage.generateRouteName();
      createRoutePage.enterRouteName(routeName);
      createRoutePage.enterPaths('/api');

      // Click Cancel
      createRoutePage.clickCancel();

      // Verify returned to service detail page with Routes tab active
      cy.url().should('include', '/services/');
      cy.url().should('include', '/routes');
      
      // Verify on Routes section
      routeManagement.verifyOnRoutesSection();
      
      // Verify Routes tab is active (highlighted)
      cy.get('[data-testid="service-routes"]').should('have.class', 'vtab-nav-item-active');
    });
  });
  }); // Close 'Create Route Form Tests'
}); // Close 'Route Creation'
