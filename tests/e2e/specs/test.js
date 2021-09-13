// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("E2E cypress sanity test", () => {
    cy.visit("/");
    cy.contains("h1", "Listen to Great Music!");
  });
});
