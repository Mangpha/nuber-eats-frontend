import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CategoryQuery, CategoryQueryVariables } from "../../__api__/CategoryQuery";

const CATEGORY_QUERY = gql`
    query CategoryQuery($input: CategoryInput!) {
        category(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category {
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

export const Categories = () => {
    const [page, setPage] = useState(1);
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    const params = useParams<{ slug: string }>();
    const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page: 1,
                slug: params.slug + "",
            },
        },
    });

    return (
        <div>
            <CustomHelmet content="Category" />
            <div className="flex justify-center font-semibold mx-auto max-w-sm mb-20">
                Category: {params.slug}
            </div>
            {!loading && (
                <div className="max-w-screen-xl mx-auto mt-8">
                    <div className="grid md:grid-cols-3 mt-16 gap-x-5 gap-y-10">
                        {data?.category.restaurants?.map((restaurant) => (
                            <Restaurant
                                id={`${restaurant.id}`}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
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
                            Page {page} of {data?.category.totalPages}
                        </span>
                        {page !== data?.category.totalPages ? (
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
