describe("Login", () => {
    it("should see login page", () => {
        cy.visit("/");
        cy.assertTitle("Login");
    });

    it("can see email / password validation", () => {
        cy.visit("/");
        cy.findByPlaceholderText(/email/i).type("error@email");
        cy.findByRole("alert").should("have.text", "Please enter a valid email");
        cy.findByPlaceholderText(/email/i).clear();
        cy.findByRole("alert").should("have.text", "Email is required");
        cy.findByPlaceholderText(/email/i).type("testing@account.com");
        cy.findByPlaceholderText(/password/i).type("error");
        cy.findByRole("alert").should("have.text", "Password must be more than 10 chars.");
        cy.findByPlaceholderText(/password/i).clear();
        cy.findByRole("alert").should("have.text", "Password is required");
        cy.findByPlaceholderText(/password/i).type("wrong password");
        cy.findByRole("button").click();
        cy.wait(100);
        cy.findByRole("alert").should("have.text", "Wrong Password");
        cy.findByPlaceholderText(/email/i).clear().type("notfound@email.com");
        cy.findByRole("button").click();
        cy.findByRole("alert").should("have.text", "User Not Found");
    });

    it("can fill out the form and log in", () => {
        cy.login("testing@account.com", "test password");
    });
});
