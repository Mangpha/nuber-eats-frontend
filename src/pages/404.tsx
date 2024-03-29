import React from "react";
import { Link } from "react-router-dom";
import { CustomHelmet } from "../components/helmet";
import { Title } from "../components/title";

export const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <CustomHelmet content="Not Found" />
            <Title title="Page Not Found." />
            <h4 className="font-medium text-lg mb-5">
                The page you're looking for does not exist or has moved.
            </h4>
            <Link className="hover:underline text-lime-600" to="/">
                Go back home &rarr;
            </Link>
        </div>
    );
};
