/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from "react";
import { mount } from "@cypress/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SinglePost from "../../src/components/singlepost/SinglePost";

// Cypress-test för SinglePost-komponenten
// Denna komponent testar att SinglePost-komponenten renderar korrekt och hanterar kommentarer
const mockPost = {
  _id: "mock-post-id",
  title: "Testinlägg",
  year: 2024,
  producer: "Testproducent",
  category: { title: "Film" },
  genres: [{ title: "Drama" }, { title: "Action" }],
  body: "Det här är en test-body.",
  comments: [
    {
      name: "Testare",
      comment: "Detta är en testkommentar.",
      createdAt: new Date().toISOString(),
    },
  ],
};

// Mockdata för ett inlägg 
const mockClient = {
  fetch: (query, params) => Promise.resolve(mockPost),
};

// Mockdata för klienten som används för att hämta inlägg
// Mockdata för klienten som används för att skriva kommentarer
const mockWriteClient = {
  patch: () => ({
    setIfMissing: () => ({
      append: () => ({
        commit: () => Promise.resolve(),
      }),
    }),
  }),
};
// Mockdata för klienten som används för att skicka kommentarer
describe("SinglePost komponent", () => {
  it("renderar post och kommentarer och kan skicka kommentar", () => {
    mount(
      <MemoryRouter initialEntries={["/post/test-slug"]}>
        <Routes>
          <Route
            path="/post/:slug"
            element={<SinglePost client={mockClient} writeClient={mockWriteClient} />}
          />
        </Routes>
      </MemoryRouter>
    );
    // Kollar att inlägget renderas korrekt 
    cy.contains("Testinlägg").should("be.visible");
    cy.contains("Testare").should("be.visible");
    cy.contains("Detta är en testkommentar.").should("be.visible");
    
    cy.get('input[placeholder="Ditt namn"]').type("Cypress Testare");
    cy.get('textarea[placeholder="Din kommentar"]').type(
      "Detta är en ny kommentar från test."
    );
    // Fyller i formuläret för att skicka en ny kommentar 
    cy.get("button[type=submit]").click();
    // Klickar på knappen för att skicka kommentaren 
    cy.contains("Kommentar skickad!").should("be.visible");
    cy.contains("Cypress Testare").should("be.visible");
    cy.contains("Detta är en ny kommentar från test.").should("be.visible");
  });
});
