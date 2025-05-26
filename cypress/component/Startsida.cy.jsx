/* eslint-disable no-undef */ 

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from "react";
import { mount } from "@cypress/react";
import Startsida from "../../src/components/startsida/Startsida"; 
import "../../src/components/startsida/Startsida.css";

// Cypress-test för Startsida-komponenten
// Denna komponent testar att Startsida-komponenten renderar senaste inlägg och populära artiklar korrekt
const mockClient = {
  fetch: (query) => {
    if (query.includes("order(_createdAt desc)")) {
      return Promise.resolve([
        {
          _id: "1",
          title: "Senaste inlägget 1",
          category: "Film",
          imageUrl: "",
          body: [
            {
              _type: "block",
              children: [{ text: "Detta är senaste nytt om film." }]
            }
          ],
          _createdAt: new Date().toISOString()
        }
      ]);
    }
    // Simulerar populära inlägg
    if (query.includes("order(likes desc)")) {
      return Promise.resolve([
        {
          _id: "2",
          title: "Populärt inlägg 1",
          category: "Musik",
          imageUrl: "",
          body: [
            {
              _type: "block",
              children: [{ text: "Detta är ett populärt inlägg om musik." }]
            }
          ],
          likes: 1337
        }
      ]);
    }
    // Om ingen matchning, returneras en tom array
    return Promise.resolve([]);
  }
};
// Mockdata för klienten som används för att hämta inlägg 
describe("<Startsida />", () => {
  beforeEach(() => {
    mount(<Startsida client={mockClient} />);
  });
  // Mountar Startsida-komponenten med mockad klient 
  // Testar att senaste inlägg visas korrekt 
  it("visar senaste inlägg från mockad data", () => {
    cy.contains("Senaste inlägg").should("be.visible");
    cy.contains("Senaste inlägget 1").should("be.visible");
  });
  // Testar att populära artiklar visas korrekt
  it("visar populära artiklar från mockad data", () => {
    cy.contains("Populärt & Trendigt").should("be.visible");
    cy.contains("Populärt inlägg 1").should("be.visible");
  });
});
