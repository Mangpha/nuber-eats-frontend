import React from "react";

interface ITitleProps {
    title: string;
}

export const Title: React.FC<ITitleProps> = ({ title }) => (
    <h2 className="font-semibold text-2xl mb-5">{title}</h2>
);
