import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { CustomHelmet } from "../../components/helmet";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__api__/CreateDishMutation";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
    mutation CreateDishMutation($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`;

interface IFormProps {
    name: string;
    price: string;
    description: string;
    [key: string]: string;
}

export const AddDish = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const [createDishMutation, { loading }] = useMutation<
        CreateDishMutation,
        CreateDishMutationVariables
    >(CREATE_DISH_MUTATION, {
        refetchQueries: [
            {
                query: MY_RESTAURANT_QUERY,
                variables: {
                    input: {
                        id: +(restaurantId + ""),
                    },
                },
            },
        ],
    });
    const { register, handleSubmit, getValues, formState, setValue } = useForm<IFormProps>({
        mode: "onChange",
    });
    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();
        const optionObjects = optionsLength.map((optionId) => ({
            name: rest[`${optionId}-optionName`],
            extra: +rest[`${optionId}-optionExtra`] || 0,
        }));
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +(restaurantId + ""),
                    options: optionObjects,
                },
            },
        });
        navigate(-1);
    };
    const [optionsLength, setOptionsLength] = useState<number[]>([]);
    const onAddOptionClick = () => {
        setOptionsLength((cur) => [Date.now(), ...cur]);
    };
    const onDeleteOptionClick = (deleteId: number) => {
        setOptionsLength((cur) => cur.filter((id) => id !== deleteId));
        setValue(`${deleteId}-optionName`, "");
        setValue(`${deleteId}-optionExtra`, "");
    };

    return (
        <div className="container flex flex-col items-center mt-28">
            <CustomHelmet content="Add Dish" />
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    {...register("name", { required: "Name is required" })}
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Name"
                />
                <input
                    {...register("price", { required: "Price is required" })}
                    className="input"
                    type="number"
                    name="price"
                    min={0}
                    placeholder="Price"
                />
                <input
                    {...register("description", { required: "Description is required" })}
                    className="input"
                    type="text"
                    name="description"
                    placeholder="Description"
                />
                <div className="mt-5 mb-10 flex flex-col items-center">
                    <h4 className="font-medium mb-1 text-lg">Dish Options</h4>
                    <span
                        onClick={onAddOptionClick}
                        className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
                    >
                        Add Dish Option
                    </span>
                    {optionsLength.length !== 0 &&
                        optionsLength.map((id) => (
                            <div key={id} className="mt-5">
                                <input
                                    {...register(`${id}-optionName`)}
                                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                                    type="text"
                                    name={`${id}-optionName`}
                                    placeholder="Option Name"
                                />
                                <input
                                    {...register(`${id}-optionExtra`)}
                                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                                    type="number"
                                    name={`${id}-optionExtra`}
                                    min={0}
                                    placeholder="Option Extra"
                                />
                                <span
                                    className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
                                    onClick={() => onDeleteOptionClick(id)}
                                >
                                    X
                                </span>
                            </div>
                        ))}
                </div>
                <Button canClick={formState.isValid} loading={loading} actionText="Create Dish" />
            </form>
        </div>
    );
};
