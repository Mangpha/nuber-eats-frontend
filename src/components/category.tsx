import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
    id: string;
    coverImg: string | null;
    name: string;
    slug: string;
}

export const Category: React.FC<ICategoryProps> = ({ id, coverImg, name, slug }) => {
    return (
        <Link to={`/category/${slug}`}>
            <div className="flex flex-col group items-center cursor-pointer" id={id}>
                <div
                    className={`w-20 h-20 rounded-full bg-no-repeat bg-cover group-hover:bg-gray-100`}
                    style={{ backgroundImage: `url(${coverImg})` }}
                ></div>
                <span className="text-sm text-center font-semibold mt-3">{name}</span>
            </div>
        </Link>
    );
};
