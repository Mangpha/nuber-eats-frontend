import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { CookedOrdersSubscription } from "../../__api__/CookedOrdersSubscription";
import { Link } from "react-router-dom";

const COOKED_ORDERS_SUBSCRIPTION = gql`
    subscription CookedOrdersSubscription {
        cookedOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

interface ICoords {
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
    const [map, setMap] = useState<google.maps.Map>();
    const [maps, setMaps] = useState<any>();

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        navigator.geolocation.watchPosition(
            ({ coords: { latitude, longitude } }) => {
                map.panTo(new maps.LatLng(latitude, longitude));
                setMap(map);
                setMaps(maps);
                setDriverCoords({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
            },
        );
    };

    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
                (results, status) => {
                    console.log(status, results);
                },
            );
        }
    }, [driverCoords.lat, driverCoords.lng]);

    const makeRoute = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsService.route(
                {
                    origin: {
                        location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
                    },
                    destination: {
                        location: new google.maps.LatLng(
                            driverCoords.lat + 0.05,
                            driverCoords.lng + 0.05,
                        ),
                    },
                    travelMode: google.maps.TravelMode.TRANSIT,
                },
                (results) => {
                    directionsRenderer.setDirections(results);
                },
            );
        }
    };

    const { data: cookedOrdersData } = useSubscription<CookedOrdersSubscription>(
        COOKED_ORDERS_SUBSCRIPTION,
    );

    useEffect(() => {
        if (cookedOrdersData?.cookedOrders.id) {
            makeRoute();
        }
    }, [cookedOrdersData]);

    return (
        <div>
            <div className="overflow-hidden" style={{ width: window.innerWidth, height: "50vh" }}>
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    defaultZoom={16}
                    defaultCenter={{
                        lat: 0,
                        lng: 0,
                    }}
                    bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAP_KEY}` }}
                >
                    <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
                </GoogleMapReact>
            </div>
            <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
                {cookedOrdersData?.cookedOrders.restaurant ? (
                    <>
                        <h1 className="text-center text-3xl font-medium">New Cooked Order</h1>
                        <h1 className="text-center text-2xl font-medium my-3">
                            Pick it up soon! @ {cookedOrdersData.cookedOrders.restaurant?.name}
                        </h1>
                        <Link
                            to={`/orders/${cookedOrdersData.cookedOrders.id}`}
                            className="btn mt-5 w-full bg-lime-600 hover:bg-lime-700 text-white block text-center"
                        >
                            Accept Challenge &rarr;
                        </Link>
                    </>
                ) : (
                    <h1 className="text-center text-3xl font-medium">No Orders yet.</h1>
                )}
            </div>
        </div>
    );
};
