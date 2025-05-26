/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import Navbar from '../../src/components/Header/Navbar';
import { MemoryRouter } from 'react-router-dom';

// Cypress-test för Navbar-komponenten
// Denna komponent testar att Navbar-komponenten renderar länkar och hamburgermeny korrekt
describe('Navbar', () => {
  it('renderar länkar och hamburgermeny', () => {
    cy.mount(
      <MemoryRouter>
        <Navbar toggleTheme={() => {}} mockUser={{ _id: 'abc123', username: 'MockUser' }} />
      </MemoryRouter>
    );
    cy.contains('Hem').should('exist');
    cy.contains('Utforska').should('exist');
    cy.contains('Profiler').should('exist');
    cy.contains('Min profil').should('exist');
    cy.contains('Skapa inlägg').should('exist');
    cy.contains('Registrera').should('exist');
    cy.get('.hamburger-container').should('exist');
  });
});
