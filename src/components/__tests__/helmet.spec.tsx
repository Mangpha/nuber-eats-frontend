import { render, waitFor } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { CustomHelmet } from "../helmet";

describe("<CustomHelmet />", () => {
    it("should render OK with props", async () => {
        const CustomHelmetProps = {
            content: "Content",
        };
        render(
            <HelmetProvider>
                <CustomHelmet {...CustomHelmetProps} />
            </HelmetProvider>,
        );
        await waitFor(() => {
            expect(document.title).toBe(`${CustomHelmetProps.content} | Nuber Eats`);
        });
    });

    it("should render OK without props", async () => {
        render(
            <HelmetProvider>
                <CustomHelmet />
            </HelmetProvider>,
        );
        await waitFor(() => {
            expect(document.title).toBe(`Home | Nuber Eats`);
        });
    });
});
