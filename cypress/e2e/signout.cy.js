// / <reference types="cypress" />

describe('signout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('signout success', () => {
    cy.get('[data-cy="signout"]').click();
    cy.url().should('include', '/login');
  });
});
