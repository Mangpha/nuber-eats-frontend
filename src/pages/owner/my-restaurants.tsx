import { gql, useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomHelmet } from "../../components/helmet";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsQuery } from "../../__api__/MyRestaurantsQuery";

export const MY_RESTAURANTS_QUERY = gql`
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
    console.log(data);

    return (
        <div>
            <CustomHelmet content="My Restaurants" />
            <div className="container mt-20">
                <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
                {data?.myRestaurants.ok && data.myRestaurants.restaurants?.length === 0 ? (
                    <div>
                        <h4 className="text-xl mb-5">You have no restaurants.</h4>
                        <Link className="link" to="/add-restaurant">
                            Create One &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 mt-16 gap-x-5 gap-y-10">
                        {data?.myRestaurants.restaurants?.map((restaurant) => (
                            <Restaurant
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                                id={`${restaurant.id}`}
                                key={restaurant.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
