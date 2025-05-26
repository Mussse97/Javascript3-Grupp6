/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import RegisterForm from '../../src/components/registerform/RegisterForm';
import * as sanityClient from '../../src/sanityClient';

// Cypress-test för RegisterForm-komponenten
// Denna komponent testar att RegisterForm-komponenten renderar korrekt och hanterar registrering
describe('RegisterForm', () => {
  beforeEach(() => {
    // Stubba Sanity-klienten
    cy.stub(sanityClient.writeClient, 'create').resolves({});
  });
  // Testar att RegisterForm-komponenten renderar korrekt och hanterar registrering
  it('visar formuläret', () => {
    cy.mount(<RegisterForm />);
    cy.contains('Skapa konto').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('textarea[name="bio"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });
  // Testar att formuläret renderar korrekt och att fälten finns 
  it('visar felmeddelande om fälten inte är ifyllda', () => {
    cy.mount(<RegisterForm />);

    // Säkerställ att fälten är tomma
    cy.get('input[name="username"]').clear();
    cy.get('input[name="email"]').clear();
    
    cy.get('button[type="submit"]').click();

    // Vänta in och kontrollera att felmeddelandet visas
    cy.contains('Användarnamn och e-post är obligatoriska fält.').should('exist');
  });
  // Testar att felmeddelande visas om obligatoriska fält inte är ifyllda 
  it('visar lyckat meddelande om registrering lyckas', () => {
    cy.mount(<RegisterForm />);
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('textarea[name="bio"]').type('Jag gillar testning.');
    cy.get('button[type="submit"]').click();
    cy.contains('Registrering lyckades!').should('exist');
  });
});
