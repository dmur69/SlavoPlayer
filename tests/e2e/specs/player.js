import { integer } from "@vee-validate/rules";

describe("Track Player", () => {
  it("plays audio track", () => {
    cy.visit("/");
    cy.wait(500);
    // select first track
    cy.get(".tst-track-name:first").click();
    cy.wait(500);
    // play track / ckick on big main button
    cy.get("#play-main").click();
    // Pause after 5 sec / click on small player button
    cy.wait(5000);
    cy.get("#play-player").click();
    // Assert
    cy.get(".player-currenttime").should("contain", "00:05");
  });
});
