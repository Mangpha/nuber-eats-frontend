import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
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
    const [callQuery, { loading, data, called }] = useLazyQuery<
        SearchRestaurantQuery,
        SearchRestaurantQueryVariables
    >(SEARCH_RESTAURANT_QUERY);

    useEffect(() => {
        const [_, query] = decodeURI(location.search).split("?term=");
        if (!query || query.length <= 2) return navigate("/", { replace: true });
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
            Search Page
        </div>
    );
};
