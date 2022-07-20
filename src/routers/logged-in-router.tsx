import { gql, useQuery } from "@apollo/client";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { MeQuery } from "../__api__/MeQuery";

const ClientRoutes = [<Route path="/" element={<Restaurants />} />];

const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            email
            role
            verified
        }
    }
`;

export const LoggedInRouter = () => {
    const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);

    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        );
    }
    return (
        <BrowserRouter>
            <Routes>
                {data.me.role === "Client" && ClientRoutes}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};
