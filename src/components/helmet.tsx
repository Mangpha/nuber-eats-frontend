import React from "react";
import { Helmet } from "react-helmet-async";

interface IHelmetProps {
    content?: string;
}

export const CustomHelmet: React.FC<IHelmetProps> = ({ content }) => {
    return (
        <Helmet>
            <title>{content ? `${content} | Nuber Eats` : "Nuber Eats"}</title>
        </Helmet>
    );
};
