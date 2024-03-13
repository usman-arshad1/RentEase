/// <reference types="cypress" />

describe('login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('empty email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email');
  });

  it('long email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-cy="email-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestname@testname.com', { delay: 25 });
    cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email up to 150 characters');
  });

  it('empty password', () => {
    cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="password-invalid"]').should('be.visible').contains('Enter a password');
  });

});