import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

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
        </div>
    );
};
