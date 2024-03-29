import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Categories } from "../pages/client/categories";
import { RestaurantDetail } from "../pages/client/restaurant-detail";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { Dashboard } from "../pages/driver/dashboard";
import { Order } from "../pages/order";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { UserRole } from "../__api__/globalTypes";

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
    {
        path: "/restaurant/:id",
        component: <MyRestaurant />,
    },
    {
        path: "/restaurant/:restaurantId/add-dish",
        component: <AddDish />,
    },
];

const driverRoutes = [
    {
        path: "/",
        component: <Dashboard />,
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
    {
        path: "/orders/:id",
        component: <Order />,
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
                {data.me.role === UserRole.Client &&
                    clientRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                {data.me.role === UserRole.Owner &&
                    ownerRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                {data.me.role === UserRole.Delivery &&
                    driverRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};
