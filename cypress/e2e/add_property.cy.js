/// <reference types="cypress" />

describe('add property page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login');
		cy.get('[data-cy="email-input"]').type('bo@horvat.com', { delay: 100 });
		cy.get('[data-cy="password-input"]').type('islanders123', { delay: 100 });
		cy.get('[data-cy="login-form"]').submit();
		cy.visit('http://localhost:8080/add_property');
	});

	afterEach(() => {
		cy.wait(1000);
	});

	it('successful in adding a property', () => {
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="street"]').type('Parsons', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[id="submit"]').click();
		cy.url().should('include', '/landlord-properties');
	});

	it('empty unit number', () => {
		cy.get('input[name="street"]').type('Parsons', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[name="unit"]').then(($input) => {
			expect($input[0].validationMessage).to.equal('Please fill out this field.');
		});		
	});

	it('negative unit number', () => {
		cy.get('input[name="street"]').type('Parsons Road', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[name="unit"]').type('-1', { delay: 100 }).then(($input) => {
			expect($input[0].validationMessage).to.equal('Value must be greater than or equal to 1.');
		});		
	});

	it('empty street', () => {
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[name="street"]').then(($input) => {
			expect($input[0].validationMessage).to.equal('Please fill out this field.');
		});		
	});

	it('long street', () => {
		cy.get('input[name="street"]').invoke('removeAttr', 'maxlength');
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[name="street"]').type('Streetstreetstreetstreetstreetstreetstreetstreetstr', { delay: 25 }).then(($input) => {
			expect($input[0].validationMessage).to.equal('Input must be less than 50 characters');
		});
	});

	it('invalid street', () => {
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton', { delay: 100 });
		cy.get('input[name="street"]').type('Parsons@', { delay: 100 }).then(($input) => {
			expect($input[0].validationMessage).to.equal('No special characters allowed');
		});
	});

	it('empty city', () => {
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="street"]').type('Parsons', { delay: 100 });
		cy.get('input[name="city"]').then(($input) => {
			expect($input[0].validationMessage).to.equal('Please fill out this field.');
		});		
	});

	it('long city', () => {
		cy.get('input[name="city"]').invoke('removeAttr', 'maxlength');
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="street"]').type('Parsons', { delay: 100 });
		cy.get('input[name="city"]').type('Edmontonedmontonedmontonedmontonedmontonedmontonedm', { delay: 25 }).then(($input) => {
			expect($input[0].validationMessage).to.equal('Input must be less than 50 characters');
		});
	});

	it('invalid city', () => {
		cy.get('input[name="unit"]').type('5', { delay: 100 });
		cy.get('input[name="street"]').type('Parsons', { delay: 100 });
		cy.get('input[name="city"]').type('Edmonton@', { delay: 100 }).then(($input) => {
			expect($input[0].validationMessage).to.equal('No special characters allowed');
		});
	});
});
