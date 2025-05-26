/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import ProfilesList from '../../src/components/profiles/ProfilesList';
import { MemoryRouter } from 'react-router-dom';

// Cypress-test för ProfilesList-komponenten
// Denna komponent testar att ProfilesList-komponenten renderar en lista med användarprofiler korrekt
describe('ProfilesList utan stubbar', () => {
  const mockUsers = [
    { _id: 'user1', username: 'Anna', bio: 'Jag gillar programmering och katter.' },
    { _id: 'user2', username: 'Bertil', bio: 'Musik och böcker är mitt liv.' },
  ];
  // Mockdata för användare
  // Testar att listan med mockade användare renderas korrekt
  it('renderar listan med mockade användare', () => {
    cy.mount(
      <MemoryRouter>
        <ProfilesList mockUsers={mockUsers} />
      </MemoryRouter>
    );

    cy.contains('Användarprofiler').should('exist');
    cy.contains('Anna').should('exist');
    cy.contains('Jag gillar programmering').should('exist');
    cy.contains('Bertil').should('exist');
    cy.contains('Musik och böcker').should('exist');
  });
});
