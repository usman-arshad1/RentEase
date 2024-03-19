describe('announcement', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('land@land.ca', {delay: 100});
    cy.get('[data-cy="password-input"]').type('land', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();
    cy.visit('http://localhost:8080/landlord-announcements?');
  });


  afterEach(() => {
    cy.wait(1000);
  });

  it('create announcement', () => {
    cy.get('[data-cy="announcement-button"]').click();
    cy.get('[id="announcementContent"]')
        .type('This is a test announcement', {delay: 2});
    cy.get('[data-cy="announcement-create"]').click();
    cy.get('[data-cy="announcement-submitted"]').should('be.visible')
        .contains('Announcement successfully submitted');
  });

  it('empty announcement', () => {
    cy.get('[data-cy="announcement-button"]').click();
    cy.get('[data-cy="announcement-create"]').click();
    cy.get('[data-cy="announcement-invalid"]').should('be.visible').
        contains('Enter an announcement');
  });

  it('view announcement', () => {
    cy.get('[data-cy="announcement-view"]').should('be.visible');
    cy.get('[data-cy="announcement-view"]').should('be.visible')
        .first().within(() => {
          cy.get('td').eq(1).should('contain', 'This is a test announcement');
        });
  });

  it('client view announcement', () => {
    cy.visit('http://localhost:8080/login');
    cy.get('[data-cy="email-input"]').type('jo@jo.ca', {delay: 100});
    cy.get('[data-cy="password-input"]').type('jo', {delay: 100});
    cy.get('[data-cy="login-form"]').submit();

    cy.visit('http://localhost:8080/tenant-announcements?');
    cy.get('[data-cy="announcement-view"]').should('be.visible')
        .first().within(() => {
          cy.get('td').eq(1).should('contain', 'This is a test announcement');
        });
  });

  it('delete announcement', () => {
    cy.get('[data-cy="announcement-view"]').should('be.visible')
        .first().within(() => {
          cy.get('[data-cy="announcement-delete"]').click();
        });
    cy.get('[data-cy="announcement-deleted"]').should('be.visible')
        .contains('Announcement successfully removed');
  });
});
