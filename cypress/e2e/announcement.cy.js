describe('announcement', () => {

    it('create announcement', () => {
        cy.visit('http://localhost:8080/login');
        cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
        cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
        cy.get('[data-cy="login-form"]').submit();

        cy.visit('http://localhost:8080/landlord-announcements?');
        cy.get('[data-cy="announcement-button"]').click();
        cy.get('[id="announcementContent"]').type('This is a test announcement', {delay: 100});
        cy.get('[data-cy="announcement-create"]').click();
    })
})