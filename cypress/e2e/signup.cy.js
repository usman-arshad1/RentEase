// / <reference types="cypress" />

describe('signup page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/signup');
  });

  afterEach(() => {
    cy.wait(1000);
  });

  it('signup success', () => {
    cy.get('[data-cy="fname-input"]').type('Cade', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Lee', {delay: 100});
    cy.get('[data-cy="email-input"]').type('cade@lee.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('cadelee123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.url().should('include', '/login?message=success');
  });

  it('empty first name', () => {
    cy.get('[data-cy="fname-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="fname-invalid"]').should('be.visible').contains('Enter a first name');
  });

  it('long first name', () => {
    cy.get('[data-cy="fname-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-cy="fname-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestname', {delay: 25});
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="fname-invalid"]').should('be.visible').contains('Enter a first name up to 150 characters');
  });

  it('empty last name', () => {
    cy.get('[data-cy="lname-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="lname-invalid"]').should('be.visible').contains('Enter a last name');
  });

  it('long last name', () => {
    cy.get('[data-cy="lname-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestname', {delay: 25});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="lname-invalid"]').should('be.visible').contains('Enter a last name up to 150 characters');
  });

  it('empty email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email');
  });

  it('long email', () => {
    cy.get('[data-cy="email-input"]').invoke('removeAttr', 'maxlength');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="email-input"]').type('Testnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestnametestname@testname.com', {delay: 25});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Enter an email up to 150 characters');
  });

  it('email already exists', () => {
    cy.get('[data-cy="fname-input"]').type('Bo', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Horvat', {delay: 100});
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('Email has already been registered');
  });

  it('empty password', () => {
    cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="password-invalid"]').should('be.visible').contains('Enter a password');
  });

  it('no role', () => {
    cy.get('[data-cy="landlord-radio"]').invoke('removeAttr', 'checked');
    cy.get('[data-cy="fname-input"]').type('Tyler', {delay: 100});
    cy.get('[data-cy="lname-input"]').type('Myers', {delay: 100});
    cy.get('[data-cy="email-input"]').type('tyler@myers.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('canucks123', {delay: 100});
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="role-invalid"]').should('be.visible').contains('Select a role');
  });
});
