import React, { useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [location, setLocation] = useState(null);

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

  return (
    <div>
      <h1>Location App</h1>
      <button onClick={getLocation}>Get My Location</button>
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Maps
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
