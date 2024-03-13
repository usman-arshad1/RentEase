/// <reference types="cypress" />

describe('landlord tenant list page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
    cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
    cy.get('[data-cy="login-form"]').submit();
    cy.visit('http://localhost:8080/landlord-tenant-list');
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('remove tenant success', () => {
    cy.get('[data-cy="tenant-row"]').should('be.visible');
    cy.get('[data-cy="remove-tenant"]').first().click();
    cy.url().should('include', '/landlord-tenant-list?remove=success');
  });

});