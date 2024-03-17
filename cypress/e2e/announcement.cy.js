describe('announcement', () => {

    afterEach(() => {
        cy.wait(1000);
    });

    it('create announcement', () => {
        cy.visit('http://localhost:8080/login');
        cy.get('[data-cy="email-input"]').type('land@land.ca', { delay: 100 });
        cy.get('[data-cy="password-input"]').type('land', { delay: 100 });
        cy.get('[data-cy="login-form"]').submit();

        cy.visit('http://localhost:8080/landlord-announcements?');
        cy.get('[data-cy="announcement-button"]').click();
        cy.get('[id="announcementContent"]').type('This is a test announcement', {delay: 2});
        cy.get('[data-cy="announcement-create"]').click();

    })

    
})