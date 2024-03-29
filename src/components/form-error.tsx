import React from "react";

interface IFormErrorProps {
    errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
    return (
        <span className="font-medium text-red-500" role="alert">
            {errorMessage}
        </span>
    );
};
