import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { GetOrderQuery, GetOrderQueryVariables } from "../__api__/GetOrderQuery";

const GET_ORDER_QUERY = gql`
    query GetOrderQuery($input: GetOrderInput!) {
        getOrder(input: $input) {
            ok
            error
            order {
                id
                status
                total
                customer {
                    email
                }
                driver {
                    email
                }
                restaurant {
                    name
                }
            }
        }
    }
`;

export const Order = () => {
    const params = useParams<{ id: string }>();
    const { data, loading } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER_QUERY, {
        variables: {
            input: {
                id: +`${params.id}`,
            },
        },
    });

    console.log(data?.getOrder);

    return (
        <div className="container mt-28 flex justify-center">
            <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center text-center pb-10">
                <h4 className="bg-gray-800 w-full py-5 text-white text-xl">Order #{params.id}</h4>
                <h5 className="p-5 pt-7 text-3xl">Total: {data?.getOrder.order?.total}₩</h5>
                <div className="p-5 text-xl grid gap-6">
                    <div className="border-t pt-5 border-gray-700">
                        Prepared By:{" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.restaurant?.name}
                        </span>
                    </div>
                    <div className="border-t pt-5 border-gray-700">
                        Deliver To:{" "}
                        <span className="font-medium">{data?.getOrder.order?.customer?.email}</span>
                    </div>
                    <div className="border-t py-5 border-gray-700 border-b">
                        Driver:{" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.driver?.email || "Not Yet."}
                        </span>
                    </div>
                    <span className="mt-5 mb-3 text-2xl text-lime-600">
                        Status: {data?.getOrder.order?.status}
                    </span>
                </div>
            </div>
        </div>
    );
};
