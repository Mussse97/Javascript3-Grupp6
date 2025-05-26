/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HamburgerMenu from '../../src/components/Header/HamburgerMenu';

// Cypress-test för HamburgerMenu-komponenten
// Denna komponent testar att HamburgerMenu-komponenten öppnar och visar menyval korrekt
describe('HamburgerMenu', () => {
  it('öppnar och visar menyval när användare är inloggad', () => {
    const mockUser = { _id: 'abc123', username: 'MockUser' };
    cy.mount(
      <MemoryRouter>
        <HamburgerMenu mockUser={mockUser} />
      </MemoryRouter>
    );
    cy.get('.hamburger').click();
    cy.contains('Min profil').should('exist');
    cy.contains('Utforska').should('exist');
  });
  // Testar att menyvalen visas korrekt när användare är inloggad 
  it('öppnar och visar menyval när användare inte är inloggad', () => {
    cy.mount(
      <MemoryRouter>
        <HamburgerMenu mockUser={null} />
      </MemoryRouter>
    );
    cy.get('.hamburger').click();
    cy.contains('Min profil').should('not.exist');
    cy.contains('Utforska').should('exist');
  });
});
