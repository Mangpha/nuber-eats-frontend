import { gql, useQuery } from "@apollo/client";
import React from "react";
import { CustomHelmet } from "../../components/helmet";
import {
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables,
} from "../../__api__/RestaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
    query RestaurantsPageQuery($input: RestaurantsInput!) {
        allCategories {
            categories {
                id
                name
                coverImg
                slug
                restaurantCount
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                id
                name
                coverImg
                address
                isPromoted
                category {
                    name
                }
            }
        }
    }
`;

export const Restaurants = () => {
    const { data, loading } = useQuery<RestaurantsPageQuery, RestaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
        {
            variables: {
                input: {
                    page: 1,
                },
            },
        },
    );
    console.log(data);

    return (
        <div>
            <CustomHelmet content="Restaurants" />
            <h1>Restaurants</h1>
        </div>
    );
};
