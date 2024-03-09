/// <reference types="cypress" />

describe('signup page', () => {
  beforeEach(function () {
    cy.visit('http://localhost:8080/signup');
  })

  it('redirect to /login?message=success on success', () => {
    cy.get('[data-cy="fname-input"]').type('Cade', { delay: 100 });
    cy.get('[data-cy="lname-input"]').type('Lee', { delay: 100 });
    cy.get('[data-cy="email-input"]').type('cade@lee.com', { delay: 100 });
    cy.get('[data-cy="password-input"]').type('cadelee123', { delay: 100 });
    cy.get('[data-cy="signup-form"]').submit();
    cy.url().should('include', '/login?message=success');
  })

  it('email already exists', () => {
    cy.get('[data-cy="fname-input"]').type('Bo', { delay: 100 });
    cy.get('[data-cy="lname-input"]').type('Horvat', { delay: 100 });
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
    cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
    cy.get('[data-cy="signup-form"]').submit();
    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('already been registered');
  })
});