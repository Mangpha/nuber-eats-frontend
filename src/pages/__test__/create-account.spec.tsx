import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { render, waitFor, RenderResult } from "../../test-utils";
import { UserRole } from "../../__api__/globalTypes";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
    const realModule = jest.requireActual("react-router-dom");
    return {
        ...realModule,
        useNavigate: () => mockPush,
    };
});

describe("<CreateAccount />", () => {
    let mockClient: MockApolloClient;
    let renderResult: RenderResult;

    beforeEach(async () => {
        await waitFor(() => {
            mockClient = createMockClient();
            renderResult = render(
                <ApolloProvider client={mockClient}>
                    <CreateAccount />
                </ApolloProvider>,
            );
        });
    });

    it("should render OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Create Account | Nuber Eats");
        });
    });

    it("should render validation errors", async () => {
        const { getByRole, getByPlaceholderText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        await waitFor(async () => {
            userEvent.type(email, "error@test");
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);

        await waitFor(async () => {
            userEvent.clear(email);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Email is required/i);

        await waitFor(async () => {
            userEvent.type(email, "success@test.ing");
            userEvent.click(button);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Password is required/i);

        await waitFor(async () => {
            userEvent.type(password, "minLength");
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Password must be more than 10 chars./i);
    });

    it("should submit mutation with form values", async () => {
        const { getByRole, getByPlaceholderText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        const formData = {
            email: "success@test.ing",
            password: "successPassword",
            role: UserRole.Client,
        };
        const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error: "mutation-error",
                },
            },
        });
        mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse);
        jest.spyOn(window, "alert").mockImplementation(() => null);
        await waitFor(async () => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(button);
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role,
            },
        });
        expect(window.alert).toHaveBeenCalledWith("Account Created!");
        const mutationError = getByRole("alert");
        expect(mockPush).toHaveBeenCalledWith("/");
        expect(mutationError).toHaveTextContent("mutation-error");
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
