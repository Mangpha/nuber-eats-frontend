import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsQuery } from "../../__api__/MyRestaurantsQuery";

const MY_RESTAURANTS_QUERY = gql`
    query MyRestaurantsQuery {
        myRestaurants {
            ok
            error
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
    const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

    return (
        <div>
            <CustomHelmet content="My Restaurants" />
            <div className="container mt-20">
                <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
                {data?.myRestaurants.ok && data.myRestaurants.restaurants?.length === 0 && (
                    <div>
                        <h4 className="text-xl mb-5">You have no restaurants.</h4>
                        <Link className="link" to="/add-restaurant">
                            Create One &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
