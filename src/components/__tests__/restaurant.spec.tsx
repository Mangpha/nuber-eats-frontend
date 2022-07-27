import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Restaurant } from "../restaurant";

describe("<Restaurant />", () => {
    it("render OK with props", () => {
        const restaurantProps = {
            id: "1",
            coverImg: "x",
            name: "name",
            categoryName: "category",
        };
        const { getByText, container } = render(
            <BrowserRouter>
                <Restaurant {...restaurantProps} />
            </BrowserRouter>,
        );
        getByText(restaurantProps.name);
        getByText(restaurantProps.categoryName);
        expect(container.firstChild).toHaveAttribute("href", `/restaurant/${restaurantProps.id}`);
    });
});
