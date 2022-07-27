import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Category } from "../category";

describe("<Category />", () => {
    it("render OK with props", () => {
        const categoryProps = {
            id: "1",
            coverImg: "coverImg",
            name: "name",
            slug: "slug",
        };
        const { getByText, container } = render(
            <BrowserRouter>
                <Category {...categoryProps} />
            </BrowserRouter>,
        );
        expect(container.firstChild).toHaveAttribute("href", `/category/${categoryProps.slug}`);
        getByText(categoryProps.name);
    });
});
