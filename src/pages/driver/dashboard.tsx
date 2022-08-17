import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
    lat: number;
    lng: number;
}

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
    const [map, setMap] = useState<any>();
    const [maps, setMaps] = useState<any>();

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        navigator.geolocation.watchPosition(
            ({ coords: { latitude, longitude } }) => {
                setMap(map);
                setMaps(maps);
                setDriverCoords({ lat: latitude, lng: longitude });
                map.panTo(new maps.LatLng(latitude, longitude));
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
            map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
        }
    }, [driverCoords.lat, driverCoords.lng]);

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
                    <div
                        // @ts-ignore
                        lat={driverCoords.lat}
                        lng={driverCoords.lng}
                        className="text-lg"
                    >
                        🚖
                    </div>
                </GoogleMapReact>
            </div>
        </div>
    );
};
