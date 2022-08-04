import React from "react";
import { Restaurant_restaurant_restaurant_menu_options } from "../__api__/Restaurant";

interface IDishProps {
    description: string;
    name: string;
    price: number;
    isCustomer?: boolean;
    options?: Restaurant_restaurant_restaurant_menu_options[] | null;
}

export const Dish: React.FC<IDishProps> = ({
    description,
    name,
    price,
    isCustomer = false,
    options,
}) => {
    return (
        <div className="px-8 pt-4 pb-8 border hover:border-gray-800 transition-all mb-5">
            <div className="mb-5">
                <h3 className="text-2xl font-medium">{name}</h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>{price}₩</span>
            {isCustomer && options?.length !== 0 && (
                <div>
                    <h5 className="font-medium mt-7 mb-3">Dish Options</h5>
                    {options?.map((option, idx) => (
                        <span className="flex items-center" key={idx}>
                            <h6 className="mr-3">{option.name}</h6>
                            <h6 className="text-sm opacity-75">({option.extra}₩)</h6>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
