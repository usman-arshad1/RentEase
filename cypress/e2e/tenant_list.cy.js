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

  it('remove tenant success', () => {
    cy.get('[data-cy="tenant-row"]').should('be.visible');
    cy.get('[data-cy="remove-tenant"]').first().click();
    cy.get('[data-cy="remove-valid"]').should('be.visible').contains('Successfully removed tenant from the property!');
  });

  it('user id is not a number for removing', () => {
    cy.get('[data-cy="tenant-row"]').should('be.visible');
    cy.get('[data-cy="remove-form"]').first().invoke('attr', 'action', '/landlord-tenant-list/remove/test');
    cy.get('[data-cy="remove-tenant"]').first().click();
    cy.get('[data-cy="remove-valid"]').should('not.exist');
  });

  it('invalid or non existing jwt should not remove tenant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/signout',
    }).then(() => {
      cy.visit('http://localhost:8080/landlord-tenant-list/remove/1');
      cy.url().should('include', '/login');
    });
  });

  it('tenants should not remove tenants', () => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('sidney@crosby.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('penguins123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.visit('http://localhost:8080/landlord-tenant-list/remove/1');
    cy.url().should('include', '/tenant-announcements');
  });

  it('invalid or non existing jwt to load landlord-tenant-list', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/signout',
    }).then(() => {
      cy.visit('http://localhost:8080/landlord-tenant-list');
      cy.url().should('include', '/login');
    });
  });

  it('tenants should not load landlord-tenant-list', () => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('sidney@crosby.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('penguins123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.visit('http://localhost:8080/landlord-tenant-list');
    cy.url().should('include', '/tenant-announcements');
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

  it('tenants should not send email', () => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('sidney@crosby.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('penguins123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/landlord-tenant-list',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        key1: 'sidney@crosby123.com',
        key2: 1,
      },
    }).then(() => {
      cy.url().should('include', '/tenant-announcements');
    });
  });
});
