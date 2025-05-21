import React from 'react';
import Navbar from '../../src/components/Header/Navbar';
import { MemoryRouter } from 'react-router-dom';

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
