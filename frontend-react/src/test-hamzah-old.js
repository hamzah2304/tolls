import React, { useState, useEffect } from "react";
import { getUserCredit, loadCurrentMessage } from "./interact";

const Hamzah = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [manualLocation, setManualLocation] = useState();
  const [balance, setBalance] = useState("No balance retrieved");
  const [message, setMessage] = useState("No connection to the network.");
  const [newMessage, setNewMessage] = useState("");

  const getLocation = () => {
    if ("geolocation" in navigator) {
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

  const getLocationManual = (squareLocation) => {
    console.log("attempting to set location manually...");
    setManualLocation(squareLocation);
  };

  const handleTestClick = () => {
    console.log("Button clicked. Test message.");
  };

  useEffect(() => {
    async function fetchMessage() {
      const message = await loadCurrentMessage();
      setMessage(message);
    }
    async function getBalance() {
      const retrievedBalance = await getUserCredit(
        "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
      );
      setBalance(retrievedBalance);
    }
    getBalance();
    fetchMessage();
  }, []);

  return (
    <div>
      <div className={"flex justify-center items-center h-screen"}>
        <div>
          <h1 className="text-3xl font-bold mb-4">Location App - Hamzah</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={getLocation}
          >
            Get My Location
          </button>
          {location && (
            <div className="mt-4">
              <h3>Location from browser</h3>
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
          <h2 className="text-3xl font-bold mb-4">
            Owned square (manual): [2,2]
          </h2>
          <h2 className="text-3xl font-bold mb-4">Manual set location</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              getLocationManual("0,0");
            }}
          >
            (0,0)
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              getLocationManual("1,1");
            }}
          >
            (1,1)
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              getLocationManual("2,2");
            }}
          >
            (2,2)
          </button>
          <p>Location set manually: {manualLocation}</p>
          <p>Location retrieved from chain:</p>
          <p>Message test: {message}</p>
          <p>userCredit balance: {balance}</p>
        </div>
      </div>
    </div>
  );
};

export default Hamzah;
