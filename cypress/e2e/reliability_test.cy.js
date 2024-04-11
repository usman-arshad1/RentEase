describe('Reliability of landlord announcement', () => {
    const numIterations = 25; // Number of times to repeat the test

    beforeEach(() => {
        cy.visit('http://localhost:8080/login');
        cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
        cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
        cy.get('[data-cy="login-form"]').submit();
        cy.visit('http://localhost:8080/landlord-announcements?');
    });

    afterEach(() => {
        cy.wait(1000);
    });

    it(`Create announcement`, () => {
        for (let i = 0; i < numIterations; i++) {
            cy.get('[data-cy="announcement-button"]').click();
            cy.wait(1000);
            cy.get('[id="announcementContent"]').type('This is a test announcement', { delay: 100 });
            cy.get('[data-cy="announcement-create"]').click();
            cy.get('[data-cy="announcement-submitted"]').should('be.visible')
                .contains('Announcement successfully submitted');
            }
        });
});