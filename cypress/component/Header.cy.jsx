/* eslint-disable no-undef */ 

// cypress/component/Header.cy.jsx
import React from 'react';
import Header from '../../src/components/Header/Header';
import { MemoryRouter } from 'react-router-dom';

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
