import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
    it("should render OK with props", () => {
        render(<Button canClick={true} loading={false} actionText={"test"} />);
        screen.getByText("test");
    });

    it("should display loading", () => {
        const { container } = render(
            <Button canClick={false} loading={true} actionText={"test"} />,
        );
        screen.getByText("Loading...");
        expect(container.firstChild).toHaveClass("pointer-events-none");
    });
});
