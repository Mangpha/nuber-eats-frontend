describe("Edit Profile", () => {
    beforeEach(() => {
        cy.login("testing@account.com", "test password");
    });

    it("can go to /edit-profile using the header", () => {
        cy.get('a[href="/edit-profile"]').click();
        cy.assertTitle("Edit Profile");
    });

    it("can change email", () => {
        cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body.operationName === "EditProfileMutation") {
                req.body.variables.input.email = "testing@account.com";
            }
        });
        cy.visit("/edit-profile");
        cy.findByPlaceholderText(/email/i).clear().type("new@email.com");
        cy.findByRole("button").click();
    });
});
