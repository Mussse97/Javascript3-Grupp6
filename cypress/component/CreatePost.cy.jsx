/* eslint-disable no-undef */

/// <reference types="cypress" />

// Importerar Cypress och mount-funktionen för att montera React-komponenter i tester
import React from 'react';
import { mount } from '@cypress/react';
import CreatePost from '../../src/components/CreatePost/CreatePost';

// Importerar CreatePost-komponenten som ska testas
describe('CreatePost komponent', () => {
  beforeEach(() => {
    // Mocka nätverksanrop till Sanity API för att undvika riktiga anrop
    cy.intercept('POST', '**/data/mutate/**', (req) => {
      // Default svar: lyckad publicering
      req.reply({
        statusCode: 200,
        body: {
          results: [{ id: 'mockedId' }],
        },
      });
    });

    // Mounta komponenten som vanligt
    mount(<CreatePost />);
  });
  // Testar att komponenten renderas korrekt 
  it('renderar formuläret med rätt fält', () => {
    cy.get('form.create-post-form').should('exist');
    cy.get('input[name="title"]').should('exist');
    cy.get('select[name="category"]').should('exist');
    cy.get('input[name="year"]').should('exist');
    cy.get('input[name="producer"]').should('exist');
    cy.get('select[name="genre"]').should('exist');
    cy.get('textarea[name="content"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Publicera');
  });
  // Testar att fälten är tomma vid start 
  it('uppdaterar fält vid inmatning', () => {
    cy.get('input[name="title"]').type('Min titel').should('have.value', 'Min titel');
    cy.get('input[name="year"]').type('2024').should('have.value', '2024');
    cy.get('input[name="producer"]').type('Någon Producent').should('have.value', 'Någon Producent');
    cy.get('textarea[name="content"]').type('Det här är en recension.').should('have.value', 'Det här är en recension.');
  });
  // Testar att kategorier och genrer laddas korrekt 
  it('ändrar genrealternativ beroende på kategori', () => {
    cy.get('select[name="category"]').select('musik');
    cy.get('select[name="genre"] option').should('have.length.greaterThan', 1);
    cy.get('select[name="genre"]').select('Jazz').should('have.value', 'Jazz');
    
    cy.get('select[name="category"]').select('spel');
    cy.get('select[name="genre"] option').contains('RPG').should('exist');
  });
  // Testar att formuläret kan skickas och att meddelanden visas korrekt 
  it('visar framgångsmeddelande vid lyckad publicering', () => {
    cy.get('input[name="title"]').type('Testtitel');
    cy.get('select[name="category"]').select('film');
    cy.get('select[name="genre"]').select('Action');
    cy.get('textarea[name="content"]').type('En bra film.');

    cy.get('form').submit();

     // Vänta på meddelandet och scrolla in det i vy om nödvändigt
  cy.contains('Inlägget har publicerats!')
    .should('exist')
    .scrollIntoView()
    .should('be.visible');
});
  // Testar att felmeddelande visas vid ogiltig inmatning 
  it('visar felmeddelande vid misslyckad publicering', () => {
    // Mocka ett fel för denna test
    cy.intercept('POST', '**/data/mutate/**', (req) => {
      req.reply({
        statusCode: 500,
        body: { error: 'Simulerat serverfel' },
      });
    });

    // Mounta komponenten igen för att använda den nya mocken
    mount(<CreatePost />);

    cy.get('input[name="title"]').type('Testtitel');
    cy.get('select[name="category"]').select('film');
    cy.get('select[name="genre"]').select('Action');
    cy.get('textarea[name="content"]').type('En bra film.');

    cy.get('form').submit();
    // Vänta på felmeddelandet och scrolla in det i vy om nödvändigt 
    cy.contains('Ett fel uppstod. Försök igen.').scrollIntoView().should('be.visible');
  });
});
