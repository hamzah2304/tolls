import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const IndexPage = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  };

  const error = (error) => {
    alert("Unable to retrieve your location.");
    console.error(error);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
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
    <div>
      <div className="flex justify-center items-center h-screen">
        <div>
          <h1 className="text-3xl font-bold mb-4">Location App</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={getLocation}
          >
            Get My Location
          </button>
          {location && (
            <div className="mt-4">
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Open Maps
                </a>
              </p>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default IndexPage;
