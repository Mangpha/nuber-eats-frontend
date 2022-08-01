import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Categories } from "../pages/client/categories";
import { RestaurantDetail } from "../pages/client/restaurant-detail";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const clientRoutes = [
    {
        path: "/",
        component: <Restaurants />,
    },
    {
        path: "/search",
        component: <Search />,
    },
    {
        path: "/category/:slug",
        component: <Categories />,
    },
    {
        path: "/restaurant/:id",
        component: <RestaurantDetail />,
    },
];

const ownerRoutes = [
    {
        path: "/",
        component: <MyRestaurants />,
    },
    {
        path: "/add-restaurant",
        component: <AddRestaurant />,
    },
];

const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail />,
    },
    {
        path: "/edit-profile",
        component: <EditProfile />,
    },
];

export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();

    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        );
    }
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {commonRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.component} />
                ))}
                {data.me.role === "Client" &&
                    clientRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                {data.me.role === "Owner" &&
                    ownerRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};
