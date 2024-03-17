describe('invite', () => {
  it('delete tenant, invite', () => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('bo@horvat.com', {delay: 100});
    cy.get('[data-cy="password-input"]').type('islanders123', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();

    cy.visit('http://localhost:8080/landlord-tenant-list', {delay: 100});
    cy.get('[id="1.delete"]').click();

    cy.visit('http://localhost:8080/landlord-tenant-list?', {delay: 100});
    cy.get('[data-bs-target="#invite-modal"]').click({delay: 100});


    cy.get('[id="email-input"]').type('joe@bob.com', {delay: 100});
    cy.get('[data-cy="submit-button"]').click();
  });
});
