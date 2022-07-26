import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables,
} from "../../__api__/SearchRestaurantQuery";

const SEARCH_RESTAURANT_QUERY = gql`
    query SearchRestaurantQuery($input: SearchRestaurantInput!) {
        searchRestaurant(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    const [callQuery, { loading, data }] = useLazyQuery<
        SearchRestaurantQuery,
        SearchRestaurantQueryVariables
    >(SEARCH_RESTAURANT_QUERY);

    useEffect(() => {
        const [_, query] = decodeURI(location.search).split("?term=");
        if (!query || query.length <= 1) return navigate("/", { replace: true });
        callQuery({
            variables: {
                input: {
                    page: 1,
                    query,
                },
            },
        });
    }, [location, navigate, callQuery]);

    return (
        <div>
            <CustomHelmet content="Search" />
            <div className="flex justify-center font-semibold mx-auto max-w-sm mt-10 mb-20">
                Search Term: {decodeURI(location.search).split("?term=")[1]}
            </div>
            {!loading && (
                <div className="max-w-screen-xl mx-auto mt-8">
                    <div className="grid md:grid-cols-3 mt-16 gap-x-5 gap-y-10">
                        {data?.searchRestaurant.restaurants?.map((restaurant) => (
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
                            Page {page} of {data?.searchRestaurant.totalPages}
                        </span>
                        {page !== data?.searchRestaurant.totalPages ? (
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
