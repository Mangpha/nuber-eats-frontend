import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from "victory";
import { Dish } from "../../components/dish";
import {
    DISH_FRAGMENT,
    FULL_ORDER_FRAGMENT,
    ORDER_FRAGMENT,
    RESTAURANT_FRAGMENT,
} from "../../fragments";
import { useMe } from "../../hooks/useMe";
import {
    CreatePaymentMutation,
    CreatePaymentMutationVariables,
} from "../../__api__/CreatePaymentMutation";
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__api__/MyRestaurantQuery";
import { PendingOrders } from "../../__api__/PendingOrders";

export const MY_RESTAURANT_QUERY = gql`
    query MyRestaurantQuery($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
                orders {
                    ...OrderParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDER_FRAGMENT}
`;

const CREATE_PAYMENT_MUTATION = gql`
    mutation CreatePaymentMutation($input: CreatePaymentInput!) {
        createPayment(input: $input) {
            ok
            error
        }
    }
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
    subscription PendingOrders {
        pendingOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const MyRestaurant = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +(id + ""),
            },
        },
    });
    let chartData = data?.myRestaurant.restaurant?.orders.slice().sort((a, b) => a.id - b.id);
    const { data: userData } = useMe();
    const onCompleted = (data: CreatePaymentMutation) => {
        if (data.createPayment.ok) {
            alert("Your restaurant is being promoted");
        }
    };
    const [createPaymentMutation, { loading }] = useMutation<
        CreatePaymentMutation,
        CreatePaymentMutationVariables
    >(CREATE_PAYMENT_MUTATION, {
        onCompleted,
    });

    // @ts-ignore
    const Paddle = window.Paddle;
    const triggerPaddle = () => {
        if (userData?.me.email) {
            Paddle.Setup({ vendor: 153550 });
            Paddle.Checkout.open({
                product: 783143,
                email: userData.me.email,
                successCallback: (data: any) => {
                    createPaymentMutation({
                        variables: {
                            input: {
                                transactionId: data.checkout.id,
                                restaurantId: +`${id}`,
                            },
                        },
                    });
                },
            });
        }
    };

    const navigate = useNavigate();
    const { data: subscriptionData } = useSubscription<PendingOrders>(PENDING_ORDERS_SUBSCRIPTION);

    useEffect(() => {
        if (subscriptionData?.pendingOrders.id) {
            navigate(`/orders/${subscriptionData.pendingOrders.id}`);
        }
    }, [subscriptionData]);

    return (
        <div>
            <Helmet>
                <title>{`${
                    data?.myRestaurant.restaurant?.name || "Loading..."
                } | Nuber Eats`}</title>
            </Helmet>
            <div
                className="bg-gray-700 py-28 bg-center bg-cover"
                style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
            ></div>
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link
                    to={`/restaurant/${id}/add-dish`}
                    className="mr-8 text-white bg-gray-800 py-3 px-10"
                >
                    Add Dish &rarr;
                </Link>
                <span
                    onClick={triggerPaddle}
                    className="text-white bg-lime-700 py-3 px-10 cursor-pointer"
                >
                    Buy Promotion &rarr;
                </span>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
                        <h4 className="text-xl mb-5">Please upload a dish.</h4>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
                            {data?.myRestaurant.restaurant?.menu?.map((dish) => (
                                <Dish
                                    key={dish.name}
                                    name={dish.name}
                                    price={dish.price}
                                    description={dish.description}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-12 mb-10">
                    <h4 className="text-center text-2xl font-medium">Sales</h4>
                    <div className="mt-10">
                        <VictoryChart
                            width={window.innerWidth}
                            height={500}
                            containerComponent={<VictoryVoronoiContainer />}
                            domainPadding={50}
                            theme={VictoryTheme.material}
                        >
                            <VictoryLine
                                labels={({ datum }) => `${datum.y}₩`}
                                labelComponent={
                                    <VictoryTooltip
                                        style={{ fontSize: 20 }}
                                        renderInPortal
                                        dy={-40}
                                    />
                                }
                                data={chartData?.map((order) => ({
                                    x: order.createdAt,
                                    y: order.total,
                                }))}
                                interpolation="natural"
                                style={{
                                    data: {
                                        strokeWidth: 5,
                                    },
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickLabelComponent={<VictoryLabel renderInPortal />}
                                style={{ tickLabels: { fontSize: 18, fill: "#4D7C0F" } }}
                                tickFormat={(tick) => `${tick}₩`}
                            />
                            <VictoryAxis
                                tickLabelComponent={<VictoryLabel renderInPortal />}
                                style={{ tickLabels: { fontSize: 18, fill: "#4D7C0F" } }}
                                label="Days"
                                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
                            />
                        </VictoryChart>
                    </div>
                </div>
            </div>
        </div>
    );
};
