import React, { ReactNode } from "react";
import { JsxChild } from "typescript";
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
    children?: ReactNode;
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
    children: dishOptions,
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
            className={`px-8 pt-4 pb-8 border transition-all ${
                isSelected ? "border-gray-800" : "hover:border-gray-800"
            }`}
        >
            <div className="mb-5">
                <h3 className="text-2xl font-medium flex items-center">
                    {name}{" "}
                    {orderStarted && (
                        <button
                            className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                                isSelected ? "bg-red-500" : " bg-lime-600"
                            }`}
                            onClick={onClick}
                        >
                            {isSelected ? "Remove" : "Add"}
                        </button>
                    )}
                </h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>{price}₩</span>
            {isCustomer && options?.length !== 0 && (
                <div>
                    <h5 className="font-medium mt-7 mb-3">Dish Options</h5>
                    <div className="grid gap-2  justify-start">{dishOptions}</div>
                </div>
            )}
        </div>
    );
};
