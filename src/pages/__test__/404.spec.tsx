import { render, waitFor } from "../../test-utils";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { NotFound } from "../404";

describe("<NotFound />", () => {
    it("should render OK", async () => {
        render(<NotFound />);
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Nuber Eats");
        });
    });
});
