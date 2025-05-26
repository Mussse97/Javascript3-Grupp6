/* eslint-disable no-undef */

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas
import React from "react";
import ProfilePage from "../../src/components/Profile/ProfilePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Cypress-test för ProfilePage-komponenten
// Denna komponent testar att ProfilePage renderar korrekt med mockdata
describe("ProfilePage utan stubbar", () => {
  const mockUser = { _id: "abc123", username: "MockUser" };
  const mockProfile = { _id: "abc123", username: "MockUser", bio: "Mock bio" };
  // Mockdata för användare och profil 
  it("renderar profil med mockdata", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/profile/abc123"]}>
        <Routes>
          <Route
            path="/profile/:id"
            element={<ProfilePage mockUser={mockUser} mockProfile={mockProfile} />}
          />
        </Routes>
      </MemoryRouter>
    );
    // Kollar att sidan renderas korrekt 
    cy.contains("Min profil").should("exist");

    // Hittar p-tag som innehåller "Användarnamn:" och kollar att den också innehåller "MockUser"
    cy.contains("Användarnamn:").parent().should("contain.text", "MockUser");

    // Samma för "Om mig:"
    cy.contains("Om mig:").parent().should("contain.text", "Mock bio");

    // Kollar att redigera-knappen finns
    cy.contains("Redigera").should("exist");
  });
});
