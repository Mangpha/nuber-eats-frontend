import { render } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
    it("renders OK with props", () => {
        const { debug } = render(<FormError errorMessage="test" />);
        debug();
    });
});
