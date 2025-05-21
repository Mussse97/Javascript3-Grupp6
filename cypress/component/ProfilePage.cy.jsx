// cypress/component/ProfilePage.cy.jsx
import React from "react";
import ProfilePage from "../../src/components/Profile/ProfilePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("ProfilePage utan stubbar", () => {
  const mockUser = { _id: "abc123", username: "MockUser" };
  const mockProfile = { _id: "abc123", username: "MockUser", bio: "Mock bio" };

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

    cy.contains("Min profil").should("exist");
    cy.contains("Användarnamn:").should("contain.text", "MockUser");
    cy.contains("Om mig:").should("contain.text", "Mock bio");
    cy.contains("Redigera").should("exist");
  });
});
