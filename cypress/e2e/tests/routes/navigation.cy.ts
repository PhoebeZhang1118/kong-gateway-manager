import { WorkspacesPage } from '../../../pages/workspace/WorkspacesPage';
import { GatewayServicesListPage } from '../../../pages/gateway-service/GatewayServicesListPage';
import { RouteManagementPage } from '../../../pages/route/RouteManagementPage';
import { CreateRoutePage } from '../../../pages/route/CreateRoutePage';

/**
 * Route Navigation Tests
 * Tests for navigating to Create Route page from different entry points
 */
describe('Route Navigation - Different Entry Points', () => {
  const workspacesPage = new WorkspacesPage();
  const gatewayServicesList = new GatewayServicesListPage();
  const routeManagement = new RouteManagementPage();
  const createRoutePage = new CreateRoutePage();

  beforeEach(() => {
    // Navigate to workspaces and wait for page load
    workspacesPage.navigateToWorkspaces();
    workspacesPage.verifyPageLoaded();
    
    // Click default row and wait for navigation
    workspacesPage.clickDefaultRow();
    cy.wait(500); // Wait for page transition
    
    // Navigate to Gateway Services and wait for page load
    gatewayServicesList.navigateToGatewayServices();
    gatewayServicesList.verifyOnGatewayServicesPage();
    cy.wait(500); // Wait for services list to load
  });

  describe('Path 1: From Service Overview Page', () => {
    it('should navigate via [Add a Route] button on service overview', () => {
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          
          // Click [Add a Route] button on service overview
          routeManagement.clickAddRouteButton();
          
          // Verify navigation to Create Route page
          createRoutePage.verifyOnCreateRoutePage();
        } else {
          cy.log('No enabled services found, skipping test');
        }
      });
    });
  });

  describe('Path 2: From Routes Tab', () => {
    it('should navigate via [New route] button in Routes tab', () => {
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          
          // Click on [Routes] tab
          routeManagement.clickRoutesTab();
          routeManagement.verifyOnRoutesSection();
          
          // Verify both buttons are visible
          routeManagement.verifyBothRouteButtonsVisible();
          
          // Click [New route] button
          routeManagement.clickNewRouteButton();
          
          // Verify navigation
          createRoutePage.verifyOnCreateRoutePage();
        } else {
          cy.log('No enabled services found, skipping test');
        }
      });
    });

    it('should navigate via [Add a Route] button in Routes tab', () => {
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          
          // Click on [Routes] tab
          routeManagement.clickRoutesTab();
          routeManagement.verifyOnRoutesSection();
          
          // Verify both buttons are visible
          routeManagement.verifyBothRouteButtonsVisible();
          
          // Click [Add a Route] button (top right)
          routeManagement.clickAddRouteButton();
          
          // Verify navigation
          createRoutePage.verifyOnCreateRoutePage();
        } else {
          cy.log('No enabled services found, skipping test');
        }
      });
    });
  });

  describe('Cancel Navigation', () => {
    it('should return to Gateway Service Routes tab when clicking Cancel', () => {
      gatewayServicesList.hasEnabledService().then((hasEnabled) => {
        if (hasEnabled) {
          gatewayServicesList.clickFirstEnabledService();
          cy.contains('Enabled').should('be.visible');
          
          // Navigate to Routes tab and click New route
          routeManagement.clickRoutesTab();
          routeManagement.verifyOnRoutesSection();
          routeManagement.clickNewRouteButton();
          
          // Verify on Create Route page
          createRoutePage.verifyOnCreateRoutePage();
          
          // Click Cancel
          createRoutePage.clickCancel();
          
          // Verify returned to Gateway Service Routes tab
          cy.url().should('include', '/services/');
          routeManagement.verifyOnRoutesSection();
          routeManagement.verifyBothRouteButtonsVisible();
        } else {
          cy.log('No enabled services found, skipping test');
        }
      });
    });
  });
});
