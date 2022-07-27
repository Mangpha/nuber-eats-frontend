import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { Header } from "../header";
import { BrowserRouter } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
    it("should renders verify banner", async () => {
        await waitFor(async () => {
            const { getByText } = render(
                <MockedProvider
                    mocks={[
                        {
                            request: {
                                query: ME_QUERY,
                            },
                            result: {
                                data: {
                                    me: {
                                        id: 1,
                                        email: "test@account.com",
                                        role: "",
                                        verified: false,
                                    },
                                },
                            },
                        },
                    ]}
                >
                    <BrowserRouter>
                        <Header />
                    </BrowserRouter>
                </MockedProvider>,
            );
            await new Promise((resolve) => setTimeout(resolve, 100));
            getByText("Please verify your email.");
        });
    });

    it("should renders without verify banner", async () => {
        await waitFor(async () => {
            const { queryByText } = render(
                <MockedProvider
                    mocks={[
                        {
                            request: {
                                query: ME_QUERY,
                            },
                            result: {
                                data: {
                                    me: {
                                        id: 1,
                                        email: "test@account.com",
                                        role: "",
                                        verified: true,
                                    },
                                },
                            },
                        },
                    ]}
                >
                    <BrowserRouter>
                        <Header />
                    </BrowserRouter>
                </MockedProvider>,
            );
            await new Promise((resolve) => setTimeout(resolve, 100));
            expect(queryByText("Please verify your email.")).toBeNull();
        });
    });
});
