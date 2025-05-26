/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas 
import React from 'react';
import Header from '../../src/components/Header/Header';
import { MemoryRouter } from 'react-router-dom';

// Cypress-test för Header-komponenten
// Denna komponent testar att Header-komponenten renderar logotyp och navigeringsmeny korrekt
describe('Header', () => {
  it('renderar logga och navbar', () => {
    cy.mount(
      <MemoryRouter>
        <Header toggleTheme={() => {}} />
      </MemoryRouter>
    );
    cy.contains('MedieTema').should('exist');
    cy.get('nav').should('exist'); // Om Navbar renderar en <nav>
  });
});
