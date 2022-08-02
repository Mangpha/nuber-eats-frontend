import { gql, useMutation } from "@apollo/client";
import React from "react";
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
    const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
        mode: "onChange",
    });
    const onSubmit = () => {
        const { name, price, description } = getValues();
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +(restaurantId + ""),
                },
            },
        });
        navigate(-1);
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
                <Button canClick={formState.isValid} loading={loading} actionText="Create Dish" />
            </form>
        </div>
    );
};
