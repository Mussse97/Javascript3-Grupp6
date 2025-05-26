/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from 'react';
import Footer from '../../src/components/Footer/Footer';

// Cypress-test för Footer-komponenten
// Denna komponent testar att Footer-komponenten renderas korrekt och innehåller sociala medie-länkar
describe('Footer', () => {
  it('renderar sociala medie-länkar', () => {
    cy.mount(<Footer />);
    cy.contains('Följ oss på sociala medier:').should('exist');
    cy.get('a[href="https://www.facebook.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href="https://www.linkedin.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href="https://www.instagram.com"]').should('have.attr', 'target', '_blank');
  });
});
