// cypress/component/ProfilesList.cy.jsx
import React from 'react';
import ProfilesList from '../../src/components/profiles/ProfilesList';
import { MemoryRouter } from 'react-router-dom';

describe('ProfilesList utan stubbar', () => {
  const mockUsers = [
    { _id: 'user1', username: 'Anna', bio: 'Jag gillar programmering och katter.' },
    { _id: 'user2', username: 'Bertil', bio: 'Musik och böcker är mitt liv.' },
  ];

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
