import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
    latitude: number;
    longitude: number;
}

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ latitude: 0, longitude: 0 });
    const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
        setDriverCoords({ latitude, longitude });
    };
    const onError = (error: GeolocationPositionError) => {
        console.log(error);
    };
    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
    }, []);

    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude));
        console.log(driverCoords);
    };

    return (
        <div>
            <div className="overflow-hidden" style={{ width: window.innerWidth, height: "95vh" }}>
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    defaultZoom={15}
                    defaultCenter={{
                        lat: 35.8433904,
                        lng: 128.530017,
                    }}
                    bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAP_KEY}` }}
                ></GoogleMapReact>
            </div>
        </div>
    );
};
