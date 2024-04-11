/// <reference types="cypress" />

describe('new feedback page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/login');
        cy.get('[data-cy="email-input"]').type('sidney@crosby.com', {delay: 100});
        cy.get('[data-cy="password-input"]').type('penguins123', {delay: 100});
        cy.get('[data-cy="login-form"]').submit();
        cy.visit('http://localhost:8080/new-feedback');
      });
  
    afterEach(() => {
      cy.wait(1000);
    });

    // it('success in creating feedback', () => {
    //     cy.get('[name="title"]').type('Yooooooo', {delay: 100});
    //     cy.get('[name="description"]').type('A description', {delay: 100});
    //     cy.get('[type="submit"]').click();
    //     cy.url().should('include', '/tenant-feedback');
    // });
  
    it('title is empty', () => {
      cy.get('[name="description"]').type('A description', {delay: 100});
      cy.get('[type="submit"]').click();
      cy.get('[data-cy="title-invalid"]').should('be.visible').contains('Enter a title');
    });

    it('title is too short', () => {
        cy.get('[name="title"]').type('Yooo', {delay: 100});
        cy.get('[name="description"]').type('A description', {delay: 100});
        cy.get('[type="submit"]').click();
        cy.get('[data-cy="title-invalid"]').should('be.visible').contains('Enter a title with a minimum of 5 characters');
    });

    it('description is empty', () => {
        cy.get('[name="title"]').type('Hello', {delay: 100});
        cy.get('[type="submit"]').click();
        cy.get('[data-cy="description-invalid"]').should('be.visible').contains('Enter a description');
    });

    it('description is too short', () => {
        cy.get('[name="title"]').type('Hello', {delay: 100});
        cy.get('[name="description"]').type('testtest', {delay: 100});
        cy.get('[type="submit"]').click();
        cy.get('[data-cy="description-invalid"]').should('be.visible').contains('Enter a description with a minimum of 10 characters');
    });
  });
  