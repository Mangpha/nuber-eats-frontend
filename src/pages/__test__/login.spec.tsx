import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Login, LOGIN_MUTATION } from "../login";

describe("<Login />", () => {
    let renderResult: RenderResult;
    let mockClient: MockApolloClient;

    beforeEach(async () => {
        await waitFor(() => {
            mockClient = createMockClient();
            renderResult = render(
                <HelmetProvider>
                    <BrowserRouter>
                        <ApolloProvider client={mockClient}>
                            <Login />
                        </ApolloProvider>
                    </BrowserRouter>
                </HelmetProvider>,
            );
        });
    });

    it("should render OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Nuber Eats");
        });
    });

    it("should display email validation errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);

        await waitFor(async () => {
            userEvent.type(email, "error@mail");
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

        await waitFor(async () => {
            userEvent.clear(email);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/email is required/i);
    });

    it("should display password errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const submitBtn = getByRole("button");

        await waitFor(async () => {
            userEvent.type(email, "test@ing.com");
            userEvent.click(submitBtn);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);

        const password = getByPlaceholderText(/password/i);
        await waitFor(async () => {
            userEvent.type(password, "test");
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password must be more than 10 chars./i);
    });

    it("should submit form and call mutation", async () => {
        const { getByPlaceholderText, getByRole, debug } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");
        const formData = {
            email: "login@test.com",
            password: "loginTestPassword",
        };
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: {
                    ok: true,
                    token: "token",
                    error: "mutation-error",
                },
            },
        });
        mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
        jest.spyOn(Storage.prototype, "setItem");

        await waitFor(async () => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password,
            },
        });

        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/mutation-error/i);
        expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "token");
    });
});
