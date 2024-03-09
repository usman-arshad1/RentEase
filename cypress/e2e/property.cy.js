describe('create property page', () => {
    it('shows property on successfull creation', () => {
        cy.visit('http://localhost:8080/login');
        cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
        cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
        cy.get('[data-cy="login-form"]').submit();

        cy.get('[id="add-property').click({delay: 100})

        cy.get('[id="unit"]').type('1853', { delay: 100 });
        cy.get('[id="street"]').type('Trinidad St', { delay: 100 });
        cy.get('[id="city"]').type('Tobago', { delay: 100 });
        cy.get('[id="province_state"]').type('BC', { delay: 100 });
        cy.get('[id="country"]').type('Canada', { delay: 100 });
        cy.get('[id="submit"]').click()
    })
});