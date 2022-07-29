describe("Create Account", () => {
    it("should see email / password validation errors", () => {
        cy.visit("/");
        cy.findByText(/Create An Account/i).click();
        cy.assertTitle("Create Account");
        cy.findByPlaceholderText(/email/i).type("error@email");
        cy.findByRole("alert").should("have.text", "Please enter a valid email");
        cy.findByPlaceholderText(/email/i).clear();
        cy.findByRole("alert").should("have.text", "Email is required");
        cy.findByPlaceholderText(/email/i).type("test@email.com");
        cy.findByPlaceholderText(/password/i).type("wrong");
        cy.findByRole("alert").should("have.text", "Password must be more than 10 chars.");
        cy.findByPlaceholderText(/password/i).clear();
        cy.findByRole("alert").should("have.text", "Password is required");
    });

    it("should be able to create account and login", () => {
        cy.intercept("http://localhost:4000/graphql", (req) => {
            const { operationName } = req.body;
            if (operationName && operationName === "CreateAccountMutation") {
                req.reply((res) => {
                    res.send({
                        fixture: "auth/create-account.json",
                    });
                });
            }
        });
        cy.visit("/");
        cy.findByText(/Create An Account/i).click();
        cy.assertTitle("Create Account");
        cy.findByPlaceholderText(/email/i).type("testing@account.com");
        cy.findByPlaceholderText(/password/i).type("test password");
        cy.findByRole("button").click();
        cy.wait(1000);
        cy.visit("/");
        cy.assertTitle("Login");
        cy.login("testing@account.com", "test password");
    });
});
