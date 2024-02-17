/// <reference types="cypress" />

describe('signup page', () => {
  beforeEach(function () {
    cy.visit('http://localhost:3000/signup');
  })

  it('redirect to /login?message=success on success', () => {
    cy.get('[data-cy="email-input"]').type('laptop@laptop.com', { delay: 100 });
    cy.get('[data-cy="password-input"]').type('password', { delay: 100 });
    cy.get('[data-cy="signup-form"]').submit();

    cy.url().should('include', '/login?message=success');
  })

  it('email already exists', () => {
    cy.get('[data-cy="email-input"]').type('laptop@laptop.com', { delay: 100 });
    cy.get('[data-cy="password-input"]').type('password', { delay: 100 });
    cy.get('[data-cy="signup-form"]').submit();

    cy.get('[data-cy="email-invalid"]').should('be.visible').contains('already been registered');
  })
});