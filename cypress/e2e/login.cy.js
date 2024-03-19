// / <reference types="cypress" />

describe('login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('landlord login success', () => {
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.url().should('include', '/landlord-properties');
  });

  it('tenant login success', () => {
    cy.get('[data-cy="email-input"]').type('sidney@crosby.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('penguins123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.url().should('include', '/tenant-announcements');
  });

  it('empty email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email');
  });

  it('long email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-cy="email-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnamete@testname.com', {delay: 25});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email up to 150 characters');
  });

  it('invalid email', () => {
    cy.get('[data-cy="email-input"]').invoke('attr', 'type', 'text');
    cy.get('[data-cy="email-input"]').type('bo.horvat', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter a valid email');
  });

  it('non-registered email', () => {
    cy.get('[data-cy="email-input"]').type('steven@stamkos.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('lightning123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Email is not registered');
  });

  it('empty password', () => {
    cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="password-invalid"]').should('be.visible').contains('Enter a password');
  });

  it('short password', () => {
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islande', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="password-invalid"]').should('be.visible').contains('Enter a password with a minimum of 8 characters');
  });

  it('incorrect password', () => {
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.get('[data-cy="password-invalid"]').should('be.visible').contains('Incorrect password');
  });
});
