describe("Login", () => {
    it("should see login page", () => {
        cy.visit("/").title().should("eq", "Login | Nuber Eats");
    });

    it("can see email / password validation", () => {
        cy.visit("/");
        cy.findByPlaceholderText(/email/i).type("error@email");
        cy.findByRole("alert").should("have.text", "Please enter a valid email");
        cy.findByPlaceholderText(/email/i).clear();
        cy.findByRole("alert").should("have.text", "Email is required");
        cy.findByPlaceholderText(/email/i).type("8350130@gmail.com");
        cy.findByPlaceholderText(/password/i).type("error");
        cy.findByRole("alert").should("have.text", "Password must be more than 10 chars.");
        cy.findByPlaceholderText(/password/i).clear();
        cy.findByRole("alert").should("have.text", "Password is required");
        cy.findByPlaceholderText(/password/i).type("wrong password");
        cy.findByRole("button").click();
        cy.wait(100);
        cy.findByRole("alert").should("have.text", "Wrong Password");
    });

    it("can fill out the form and log in", () => {
        cy.visit("/");
        cy.findByPlaceholderText(/email/i).type("8350130@gmail.com");
        cy.findByPlaceholderText(/password/i).type("1234512345");
        cy.findByRole("button").should("not.have.class", "pointer-events-none").click();
        cy.window().its("localStorage.nuber-token").should("be.a", "string");
    });
});
