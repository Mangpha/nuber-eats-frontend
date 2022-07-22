import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
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
    const params = useParams<{ slug: string }>();
    const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page: 1,
                slug: params.slug + "",
            },
        },
    });
    console.log(data);

    return <div>Category Page</div>;
};
