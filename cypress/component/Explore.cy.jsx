/* eslint-disable no-undef */

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Explore from "../../src/components/Explore/Explore";

// Importerar mockade Sanity-klienter för att undvika riktiga API-anrop
import * as sanityClientModule from "../../src/sanityClient";

// Cypress-test för Explore-komponenten
// Denna komponent testar att Explore-komponenten renderas korrekt och innehåller förväntade element
describe("Explore component", () => {
  const mockPosts = [
    {
      _id: "post1",
      title: "Test Inlägg 1",
      slug: { current: "test-inlagg-1" },
      year: 2024,
      producer: "Testproducent",
      category: { title: "🎮 Spel", slug: { current: "spel" } },
      genres: [{ title: "Action" }],
      body: "Det här är ett testinlägg",
      likes: 5,
      dislikes: 1,
    },
  ];

  beforeEach(() => {
    // Mocka client.fetch att alltid returnera mockPosts
    cy.stub(sanityClientModule.client, "fetch").resolves(mockPosts);

    // Mocka writeClient.patch och commit för like/dislike
    cy.stub(sanityClientModule.writeClient, "patch").returns({
      setIfMissing: () => ({
        inc: () => ({
          commit: () => Promise.resolve(),
        }),
      }),
      dec: () => ({
        commit: () => Promise.resolve(),
      }),
    });

    // Mounta komponenten med MemoryRouter
    cy.mount(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );
  });
  // Testar att komponenten renderas korrekt och innehåller förväntade element 
  it("renders the main heading", () => {
    cy.contains("Upptäck senaste inläggen").should("exist");
  });
  // Testar att kategoriknappar renderas korrekt 
  it("renders category buttons", () => {
    cy.get(".category-buttons button").should("have.length", 4);
    cy.contains("🎮 Spel").should("exist");
    cy.contains("🎬 Film").should("exist");
    cy.contains("🎵 Musik").should("exist");
    cy.contains("📚 Böcker").should("exist");
  });
  // Testar att filtersektionen renderas korrekt 
  it("renders filter section with toggle", () => {
    cy.get(".filter-section h2").should("contain.text", "Filtrera ▼");
  });
  // Testar att söksektionen renderas korrekt 
  it("renders search input and button", () => {
    cy.get('input[placeholder="Sök..."]').should("exist");
    cy.contains("Sök").should("exist");
  });
  // Testar att inläggssektionen renderas korrekt och innehåller mockade data 
  it("renders posts section with heading", () => {
    cy.get(".posts-section h2").should("contain.text", "Inlägg");
  });
  // Testar att inlägg renderas från mockad data 
  it("renders post from mocked data", () => {
    cy.contains("Test Inlägg 1").should("exist");
    cy.contains("Det här är ett testinlägg").should("exist");
  });
});
