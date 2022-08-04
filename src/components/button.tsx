import React from "react";

interface IButtonProps {
    canClick: boolean;
    loading: boolean;
    actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
    return (
        <button
            role="button"
            className={`btn text-white ${
                canClick ? "bg-lime-600 hover:bg-lime-700" : "bg-gray-300 pointer-events-none"
            }`}
        >
            {loading ? "Loading..." : actionText}
        </button>
    );
};
