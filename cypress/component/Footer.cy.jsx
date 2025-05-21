// cypress/component/Footer.cy.jsx
import React from 'react';
import Footer from '../../src/components/Footer/Footer';

describe('Footer', () => {
  it('renderar sociala medie-länkar', () => {
    cy.mount(<Footer />);
    cy.contains('Följ oss på sociala medier:').should('exist');
    cy.get('a[href="https://www.facebook.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href="https://www.linkedin.com"]').should('have.attr', 'target', '_blank');
    cy.get('a[href="https://www.instagram.com"]').should('have.attr', 'target', '_blank');
  });
});
