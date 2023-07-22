import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import styles from "../styles/GeoLocationComponent.module.css";

const GeoLocationComponent = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });

      // Cleanup function to stop watching the user's location when the component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      <div>
        <button onClick={getLocation}>Get Location</button>
        {location.latitude && location.longitude && (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=14/${location.latitude}/${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps
            </a>
          </div>
        )}
      </div>
      <div>
        {location.latitude && location.longitude ? (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=14/${location.latitude}/${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps
            </a>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[location.latitude, location.longitude]} />
            </MapContainer>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default GeoLocationComponent;
