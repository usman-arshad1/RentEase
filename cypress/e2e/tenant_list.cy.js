// / <reference types="cypress" />

describe('landlord tenant list page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.visit('http://localhost:8080/landlord-tenant-list');
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('email invitation sent success', () => {
    cy.get('[data-bs-target="#invite-modal"]').click();
    cy.wait(1000);
    cy.get('[data-cy="email-input"]').type('renteaseproject@gmail.com', {delay: 100});
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-sent-valid"]').should('be.visible').contains('Successfully sent the email invitation!');
  });

  it('empty email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
    cy.get('[data-bs-target="#invite-modal"]').click();
    cy.wait(1000);
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email');
  });

  it('invalid email', () => {
    cy.get('[data-cy="email-input"]').invoke('attr', 'type', 'text');
    cy.get('[data-bs-target="#invite-modal"]').click();
    cy.wait(1000);
    cy.get('[data-cy="email-input"]').type('elias.petey', {delay: 100});
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter a valid email');
  });

  it('long email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-bs-target="#invite-modal"]').click();
    cy.wait(1000);
    cy.get('[data-cy="email-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnamete@testname.com', {delay: 25});
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email up to 150 characters');
  });

  it('tenant already assigned to a property', () => {
    cy.get('[data-bs-target="#invite-modal"]').click();
    cy.wait(1000);
    cy.get('[data-cy="email-input"]').type('elias@petey.com');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Tenant is already assigned to a property');
  });
});
