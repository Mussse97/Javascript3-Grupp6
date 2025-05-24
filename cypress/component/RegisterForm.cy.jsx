/* eslint-disable no-undef */ 

// cypress/component/RegisterForm.cy.jsx
import React from 'react';
import RegisterForm from '../../src/components/registerform/RegisterForm';
import * as sanityClient from '../../src/sanityClient';

describe('RegisterForm', () => {
  beforeEach(() => {
    // Stubba Sanity-klienten
    cy.stub(sanityClient.writeClient, 'create').resolves({});
  });

  it('visar formuläret', () => {
    cy.mount(<RegisterForm />);
    cy.contains('Skapa konto').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('textarea[name="bio"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('visar felmeddelande om fälten inte är ifyllda', () => {
    cy.mount(<RegisterForm />);

    // Säkerställ att fälten är tomma
    cy.get('input[name="username"]').clear();
    cy.get('input[name="email"]').clear();

    cy.get('button[type="submit"]').click();

    // Vänta in och kontrollera att felmeddelandet visas
    cy.contains('Användarnamn och e-post är obligatoriska fält.').should('exist');
  });

  it('visar lyckat meddelande om registrering lyckas', () => {
    cy.mount(<RegisterForm />);
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('textarea[name="bio"]').type('Jag gillar testning.');
    cy.get('button[type="submit"]').click();
    cy.contains('Registrering lyckades!').should('exist');
  });
});
