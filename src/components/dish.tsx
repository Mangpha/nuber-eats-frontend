import React from "react";
import { Restaurant_restaurant_restaurant_menu_options } from "../__api__/Restaurant";

interface IDishProps {
    dishId?: number;
    description: string;
    name: string;
    price: number;
    isCustomer?: boolean;
    isSelected?: boolean;
    options?: Restaurant_restaurant_restaurant_menu_options[] | null;
    orderStarted?: boolean;
    addItemToOrder?: (dishId: number) => void;
    removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
    dishId = 0,
    description,
    name,
    price,
    options,
    isSelected,
    isCustomer = false,
    orderStarted = false,
    addItemToOrder,
    removeFromOrder,
}) => {
    const onClick = () => {
        if (orderStarted) {
            if (!isSelected && addItemToOrder) {
                return addItemToOrder(dishId);
            }
            if (isSelected && removeFromOrder) {
                return removeFromOrder(dishId);
            }
        }
    };
    return (
        <div
            onClick={onClick}
            className={`px-8 pt-4 pb-8 border transition-all ${
                isSelected ? "border-gray-800" : "hover:border-gray-800"
            }`}
        >
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
