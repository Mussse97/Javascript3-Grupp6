describe('Explore Page', () => {
  beforeEach(() => {
  cy.visit('http://localhost:5173/explore');
  cy.contains('Inlägg'); // Vänta in sidladdning
});

  it('renders the page correctly', () => {
    cy.contains('Upptäck senaste inläggen');
    cy.get('input[placeholder="Sök..."]').should('exist');
    cy.get('.category-btn').should('have.length', 4);
  });

  it('filters posts by category', () => {
    cy.contains('🎬 Film').click();
    cy.get('.post-card').should('exist');
    cy.contains('Kategori: Film');
  });

//   it('filters posts by genre after selecting a category', () => {
//     cy.contains('🎮 Spel').click();
//     cy.contains('Filtrera').click();
//     cy.get('.genre-filters input[type="checkbox"]').first().check({ force: true });
//     cy.get('.post-card').should('exist');
//   });

it('filters posts by genre after selecting a category', () => {
  cy.contains('🎮 Spel').click(); // steg 1
  cy.contains('Filtrera').click(); // steg 2

  cy.contains('label', 'Action') // eftersom att vissa genrer inte har en trfäff så lägger vi in en som redan har det.
    .find('input[type="checkbox"]')
    .check({ force: true });

  cy.get('.post-card').should('exist');
});

  it('searches for a post', () => {
    cy.get('input[placeholder="Sök..."]').type('Expedition 33'); // vi söker efter ett inlägg som vi vet finns
    cy.get('.cta-button').click();
    cy.get('.post-card').should('exist');
    cy.contains('Expedition 33');
  });

  it('likes and dislikes a post', () => {
    cy.get('.post-card').first().within(() => {
      cy.contains('👍').click();
      cy.contains('👎').click();
    });
  });

  it('shows most liked posts', () => {
    cy.contains('Mest gillade').click();
    cy.get('.post-card').should('exist');
  });

  it('shows least liked posts', () => {
    cy.contains('Minst gillade').click();
    cy.get('.post-card').should('exist');
  });
});
