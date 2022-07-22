import React from "react";

interface IRestaurantProps {
    coverImg: string;
    name: string;
    categoryName?: string;
    id: string;
    index: number;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
    coverImg,
    name,
    categoryName,
    id,
    index,
}) => (
    <div className="flex flex-col" key={index}>
        <div
            style={{ backgroundImage: `url(${coverImg})` }}
            className="py-28 bg-cover bg-no-repeat bg-center mb-3"
        ></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="border-t py-2 mt-2 text-xs opacity-50 border-gray-400">
            {categoryName}
        </span>
    </div>
);
