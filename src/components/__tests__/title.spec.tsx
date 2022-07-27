import { render } from "@testing-library/react";
import React from "react";
import { Title } from "../title";

describe("<Title />", () => {
    it("should render OK with props", () => {
        const TitleProps = {
            title: "Title",
        };
        const { getByText } = render(<Title {...TitleProps} />);
        getByText(TitleProps.title);
    });
});
