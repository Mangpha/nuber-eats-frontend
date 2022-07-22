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

    return (
        <div>
            <CustomHelmet content="Restaurants" />
            <form className="bg-gray-700 w-full py-40 flex items-center justify-center">
                <input
                    type="Search"
                    className="input w-4/12 rounded-md border-0"
                    placeholder="Search Restaurants"
                />
            </form>
            {!loading && (
                <div className="max-w-screen-xl mx-auto mt-8">
                    <div className="flex justify-around mx-auto max-w-sm">
                        {data?.allCategories.categories?.map((category) => (
                            <div className="flex flex-col items-center cursor-pointer">
                                <div
                                    className={`w-20 h-20 rounded-full bg-no-repeat bg-cover hover:bg-gray-100`}
                                    style={{ backgroundImage: `url(${category.coverImg})` }}
                                ></div>
                                <span className="text-sm text-center font-semibold mt-1">
                                    {category.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
