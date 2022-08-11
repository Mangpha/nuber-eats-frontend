import React from "react";
import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
    return (
        <div>
            <div className="overflow-hidden" style={{ width: window.innerWidth, height: "95vh" }}>
                <GoogleMapReact
                    defaultZoom={20}
                    defaultCenter={{
                        lat: 10.99835602,
                        lng: 77.01502627,
                    }}
                    bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAP_KEY}` }}
                >
                    <h1>Hello</h1>
                </GoogleMapReact>
            </div>
        </div>
    );
};
