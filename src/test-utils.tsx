import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

const AllTheProviders: React.FC = ({ children }: any) => {
    return (
        <HelmetProvider>
            <BrowserRouter>{children}</BrowserRouter>
        </HelmetProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: any) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
