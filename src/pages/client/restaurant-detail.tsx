import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { Restaurant, RestaurantVariables } from "../../__api__/Restaurant";

const RESTAURANT_DETAIL_QUERY = gql`
    query Restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
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
        </div>
    );
};