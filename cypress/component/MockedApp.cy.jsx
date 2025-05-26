/* eslint-disable no-undef */

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import MockedApp from '../__mocks__/MockedApp';

// Cypress-test för MockedApp-komponenten
// Denna komponent testar att MockedApp renderar korrekt och hanterar teman och navigering
describe('MockedApp', () => {
  it('renders mocked homepage and toggles theme', () => {
    cy.mount(<MockedApp />);
    cy.contains('Mocked Startsida').should('exist');
    cy.get('button').contains('Toggle Theme').click();
    cy.get('body').should('have.class', 'light-theme');
  });
  // Testar att MockedApp renderar startsidan och att tema kan växlas
  it('navigates to Explore', () => {
    cy.mount(<MockedApp />);
    cy.contains('Explore').click();
    cy.contains('Mocked Explore').should('exist');
  });
});
