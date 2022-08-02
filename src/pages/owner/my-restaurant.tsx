import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { CustomHelmet } from "../../components/helmet";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__api__/MyRestaurantQuery";

export const MY_RESTAURANT_QUERY = gql`
    query MyRestaurantQuery($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
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

export const MyRestaurant = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +(id + ""),
            },
        },
    });
    console.log(data);

    return (
        <div>
            <CustomHelmet content={data?.myRestaurant.restaurant?.name || "Loading..."} />
            <div
                className="bg-gray-700 py-28 bg-center bg-cover"
                style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
            ></div>
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link
                    to={`/restaurant/${id}/add-dish`}
                    className="mr-8 text-white bg-gray-800 py-3 px-10"
                >
                    Add Dish &rarr;
                </Link>
                <Link to={``} className="text-white bg-lime-700 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
                        <h4 className="text-xl mb-5">Please upload a dish.</h4>
                    ) : (
                        <div className="grid md:grid-cols-3 mt-16 gap-x-5 gap-y-10">
                            {data?.myRestaurant.restaurant?.menu?.map((dish) => (
                                <Dish
                                    name={dish.name}
                                    price={dish.price}
                                    description={dish.description}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
