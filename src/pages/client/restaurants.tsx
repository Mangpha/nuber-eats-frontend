import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables,
} from "../../__api__/RestaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
    query RestaurantsPageQuery($input: RestaurantsInput!) {
        allCategories {
            categories {
                ...CategoryParts
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${CATEGORY_FRAGMENT}
    ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
    searchTerm: string;
}

export const Restaurants = () => {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { data, loading } = useQuery<RestaurantsPageQuery, RestaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
        {
            variables: {
                input: {
                    page,
                },
            },
        },
    );

    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    const { register, handleSubmit, getValues } = useForm<IFormProps>();
    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        navigate({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        });
    };

    return (
        <div>
            <CustomHelmet />
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                className="bg-gray-700 w-full py-40 flex items-center justify-center"
            >
                <input
                    {...register("searchTerm", { required: true, min: 3 })}
                    type="Search"
                    name="searchTerm"
                    className="input md:w-4/12 w-3/4 rounded-md border-0"
                    placeholder="Search Restaurants"
                />
            </form>
            {!loading && (
                <div className="max-w-screen-xl mx-auto mt-8 pb-20">
                    <div className="flex justify-around mx-auto max-w-sm">
                        {data?.allCategories.categories?.map((category) => (
                            <div
                                className="flex flex-col group items-center cursor-pointer"
                                key={category.id}
                            >
                                <div
                                    className={`w-20 h-20 rounded-full bg-no-repeat bg-cover group-hover:bg-gray-100`}
                                    style={{ backgroundImage: `url(${category.coverImg})` }}
                                ></div>
                                <span className="text-sm text-center font-semibold mt-3">
                                    {category.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="grid md:grid-cols-3 mt-16 gap-x-5 gap-y-10">
                        {data?.restaurants.results?.map((restaurant) => (
                            <Restaurant
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                                id={`${restaurant.id}`}
                                key={restaurant.id}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                        {page > 1 ? (
                            <button
                                onClick={onPrevPageClick}
                                className="font-medium text-2xl focus:outline-none"
                            >
                                &larr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <span>
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages ? (
                            <button
                                onClick={onNextPageClick}
                                className="font-medium text-2xl focus:outline-none"
                            >
                                &rarr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
