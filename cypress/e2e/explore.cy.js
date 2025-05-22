describe('Explore Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/explore');
  });

  it('renders the page correctly', () => {
    cy.contains('Upptäck senaste inläggen');
    cy.get('input[placeholder="Sök..."]').should('exist');
    cy.get('.category-btn').should('have.length', 4); // Spel, Film, Musik, Böcker
  });

  it('filters posts by category', () => {
    cy.contains('🎬 Film').click();
    cy.get('.post-card').should('exist'); // Antar att det finns minst ett inlägg för Film
    cy.contains('Kategori: Film');
  });

  it('filters posts by genre after selecting a category', () => {
    cy.contains('🎮 Spel').click();
    cy.contains('Filtrera').click();
    cy.get('.genre-filters input[type="checkbox"]').first().check({ force: true });
    cy.get('.post-card').should('exist'); // Inlägg som matchar genre + spel
  });

  it('searches for a post', () => {
    cy.get('input[placeholder="Sök..."]').type('test');
    cy.contains('Sök').click();
    cy.get('.post-card').should('exist'); // Om 'test' ger resultat
  });

  it('likes and dislikes a post', () => {
    cy.get('.post-card').first().within(() => {
      cy.get('button').contains('👍').click();
      cy.get('button').contains('👎').click(); // Denna bör vara inaktiv nu
    });
  });

  // Kollar om inlägg visas när knappen trycks
  //Kan ändras då det inte riktigt är bästa testet för knapparna.
  // Kan kolla om den kan gå igenom alla inlägg och faktiskt klolla att de som syns har mest likes
  it('shows most liked posts', () => {
    cy.contains('Mest gillade').click();
    cy.get('.post-card').should('exist'); 
  });

  it('shows least liked posts', () => {
    cy.contains('Minst gillade').click();
    cy.get('.post-card').should('exist');
  });
});
