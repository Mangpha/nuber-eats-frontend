import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
    CreateOrderMutation,
    CreateOrderMutationVariables,
} from "../../__api__/CreateOrderMutation";
import { CreateOrderItemInput } from "../../__api__/globalTypes";
import { Restaurant, RestaurantVariables } from "../../__api__/Restaurant";

const RESTAURANT_DETAIL_QUERY = gql`
    query Restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrderMutation($input: CreateOrderInput!) {
        createOrder(input: $input) {
            ok
            error
            orderId
        }
    }
`;

export const RestaurantDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { loading, data } = useQuery<Restaurant, RestaurantVariables>(RESTAURANT_DETAIL_QUERY, {
        variables: {
            input: {
                restaurantId: +(id + ""),
            },
        },
    });
    const getItem = (dishId: number) => {
        return orderItems.find((order) => order.dishId === dishId);
    };
    const isSelected = (dishId: number) => {
        return Boolean(getItem(dishId));
    };
    const [orderStarted, setOrderStarted] = useState(false);
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
    const triggerStartOrder = () => {
        setOrderStarted(true);
    };
    const addItemToOrder = (dishId: number) => {
        if (isSelected(dishId)) return;
        setOrderItems((current) => [{ dishId, options: [] }, ...current]);
    };
    const removeFromOrder = (dishId: number) => {
        setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
    };
    const addOptionToItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) return;
        const oldItem = getItem(dishId);
        if (oldItem) {
            const hasOption = Boolean(
                oldItem.options?.find((aOption) => aOption.name === optionName),
            );
            if (!hasOption) {
                removeFromOrder(dishId);
                setOrderItems((current) => [
                    { dishId, options: [{ name: optionName }, ...oldItem.options!] },
                    ...current,
                ]);
            }
        }
    };
    const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
        return item.options?.find((option) => option.name === optionName);
    };
    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItem(dishId);
        if (item) {
            return Boolean(getOptionFromItem(item, optionName));
        }
        return false;
    };
    const removeOptionFromItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) return;
        const oldItem = getItem(dishId);
        if (oldItem) {
            removeFromOrder(dishId);
            setOrderItems((current) => [
                {
                    dishId,
                    options: oldItem.options?.filter((option) => option.name !== optionName),
                },
                ...current,
            ]);
        }
    };
    const triggerCancelOrder = () => {
        setOrderStarted(false);
        setOrderItems([]);
    };
    const navigate = useNavigate();
    const onCompleted = (data: CreateOrderMutation) => {
        const { ok, orderId } = data.createOrder;
        if (ok) {
            navigate(`/orders/${orderId}`);
        }
    };
    const [createOrderMutation, { loading: placingOrder }] = useMutation<
        CreateOrderMutation,
        CreateOrderMutationVariables
    >(CREATE_ORDER_MUTATION, {
        onCompleted,
    });
    const triggerConfirmOrder = () => {
        if (orderItems.length === 0) {
            alert("Can't place empty order");
            return;
        }
        const ok = confirm("You are about to place an order");
        if (ok) {
            createOrderMutation({
                variables: {
                    input: {
                        restaurantId: +`${id}`,
                        items: orderItems,
                    },
                },
            });
        }
    };
    return (
        <div>
            <div
                className="bg-gray-800 py-48 bg-center bg-cover"
                style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
            >
                <div className="bg-white w-4/12 py-8 pl-48">
                    <h4 className="text-3xl mb-3">{data?.restaurant.restaurant?.name}</h4>

                    <h5 className="text-sm font-light mb-2">
                        {data?.restaurant.restaurant?.category?.name}
                    </h5>

                    <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
                </div>
            </div>

            <div className="container mt-20 flex flex-col items-end pb-32">
                {!orderStarted && (
                    <button
                        onClick={triggerStartOrder}
                        className="btn bg-lime-600 hover:bg-lime-700 text-white px-10"
                    >
                        Start Order
                    </button>
                )}
                {orderStarted && (
                    <div className="flex items-center">
                        <button
                            onClick={triggerConfirmOrder}
                            className="btn bg-lime-600 hover:bg-lime-700 text-white px-10 mr-3"
                        >
                            Contirm Order
                        </button>
                        <button
                            onClick={triggerCancelOrder}
                            className="btn text-white px-10 bg-black"
                        >
                            Cancel Order
                        </button>
                    </div>
                )}

                <div className="w-full grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
                    {data?.restaurant.restaurant?.menu?.map((dish, idx) => (
                        <Dish
                            key={idx}
                            dishId={dish.id}
                            orderStarted={orderStarted}
                            name={dish.name}
                            price={dish.price}
                            description={dish.description}
                            isSelected={isSelected(dish.id)}
                            isCustomer={true}
                            options={dish.options}
                            addItemToOrder={addItemToOrder}
                            removeFromOrder={removeFromOrder}
                        >
                            {dish.options?.map((option, idx) => (
                                <DishOption
                                    key={idx}
                                    isSelected={isOptionSelected(dish.id, option.name)}
                                    name={option.name}
                                    extra={option.extra}
                                    dishId={dish.id}
                                    addOptionToItem={addOptionToItem}
                                    removeOptionFromItem={removeOptionFromItem}
                                />
                            ))}
                        </Dish>
                    ))}
                </div>
            </div>
        </div>
    );
};
