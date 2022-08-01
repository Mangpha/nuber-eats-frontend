import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { CustomHelmet } from "../../components/helmet";
import {
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables,
} from "../../__api__/CreateRestaurantMutation";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation CreateRestaurantMutation($input: CreateRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
            restaurantId
        }
    }
`;

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList;
}

export const AddRestaurant = () => {
    const {
        register,
        getValues,
        formState: { isValid },
        handleSubmit,
    } = useForm<IFormProps>({ mode: "onChange" });
    const navigate = useNavigate();
    const client = useApolloClient();
    const [imgUrl, setImgUrl] = useState("");
    const onCompleted = (data: CreateRestaurantMutation) => {
        const { ok, restaurantId } = data.createRestaurant;
        const { name, address, categoryName } = getValues();
        if (ok) {
            setUploading(false);
            const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
            client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                data: {
                    myRestaurants: {
                        ...queryResult.myRestaurants,
                        restaurants: [
                            {
                                name,
                                isPromoted: false,
                                id: restaurantId,
                                coverImg: imgUrl,
                                category: { __typename: "Category", name: categoryName },
                                __typename: "Restaurant",
                                address,
                            },
                        ],
                    },
                },
            });
            navigate("/");
        }
    };
    const [createRestaurantMutation, { data }] = useMutation<
        CreateRestaurantMutation,
        CreateRestaurantMutationVariables
    >(CREATE_RESTAURANT_MUTATION, {
        onCompleted,
    });
    const [uploading, setUploading] = useState(false);
    const onSubmit = async () => {
        try {
            setUploading(true);
            const { file, name, address, categoryName } = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append("file", actualFile);
            const { url: coverImg } = await (
                await fetch(`http://localhost:4000/uploads`, {
                    method: "POST",
                    body: formBody,
                })
            ).json();
            setImgUrl(coverImg);
            createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        address,
                        categoryName,
                        coverImg,
                    },
                },
            });
            setUploading(false);
        } catch {}
    };

    return (
        <div className="container mt-20 flex flex-col items-center">
            <CustomHelmet content="Add Restaurant" />
            <h1>Add Restaurant</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <input
                    {...register("name", { required: "Name is required." })}
                    name="name"
                    className="input"
                    type="text"
                    placeholder="Name"
                    required
                />
                <input
                    {...register("address", { required: "Address is required." })}
                    name="address"
                    className="input"
                    type="text"
                    placeholder="Address"
                    required
                />
                <input
                    {...register("categoryName", { required: "Category Name is required." })}
                    name="categoryName"
                    className="input"
                    type="text"
                    placeholder="Category Name"
                    required
                />
                <input
                    {...register("file", { required: true })}
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                />
                <Button canClick={isValid} loading={uploading} actionText="Create Restaurant" />
                {data?.createRestaurant.error && (
                    <FormError errorMessage={data.createRestaurant.error} />
                )}
            </form>
        </div>
    );
};
