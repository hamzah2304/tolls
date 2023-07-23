import React, { useState, useEffect } from "react";
import {
  tollsMainContract,
  getUserCredit,
  loadCurrentMessage,
  getUserInfo,
  updateMessage,
  writeUserLocation,
  depositTokens,
  buyLand,
  getLandInfo,
} from "./interact";

import { useAccount } from "wagmi";

const Hamzah = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [manualLocation, setManualLocation] = useState();
  const [balance, setBalance] = useState("No balance retrieved");
  const [message, setMessage] = useState("No connection to the network.");
  const [userInfo, setUserInfo] = useState();
  // const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");

  const { address } = useAccount();

  console.log("Address:", address);

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

  const newMessage = "test1";

  const onUpdatePressed = async () => {
    console.log("attempting to update message..");
    const { status } = await updateMessage(address, newMessage);
    setStatus(status);
  };

  const onLocationUpdate = async (latitude, longitude) => {
    console.log("attempting to update location...");
    const { status } = await writeUserLocation(latitude, longitude, address);
    setStatus(status);
  };

  // const amount = 10;

  const onCreditDeposit = async (amount) => {
    console.log("attempting to deposit credits...");
    const { status } = await depositTokens(amount, address);
    setStatus(status);
  };

  const onLandBuy = async (latitude, longitude, amount_sent) => {
    console.log("attempting to buy land...");
    const { status } = await buyLand(latitude, longitude, address, amount_sent);
    setStatus(status);
  };

  function addSmartContractListener() {
    tollsMainContract.events.TollPayment({}, (error, data) => {
      if (error) {
        console.log("event listener error:", error.message);
      } else {
        getBalance();
        console.log("Toll payment made");
      }
    });
  }

  async function getBalance() {
    const retrievedBalance = await getUserCredit(
      "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
    );
    setBalance(retrievedBalance);
  }

  useEffect(() => {
    async function fetchMessage() {
      const message = await loadCurrentMessage();
      setMessage(message);
    }
    async function retrieveUserInfo() {
      const retrievedUserInfo = await getUserInfo(
        "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
      );
      console.log(retrieveUserInfo);
      const retrievedUserLocation = [
        retrievedUserInfo.latitude,
        retrievedUserInfo.longitude,
      ];
      setUserInfo(retrievedUserLocation);
    }

    getBalance();
    fetchMessage();
    retrieveUserInfo();
    addSmartContractListener();
  }, []);

  const [latitudeQuery, setLatitudeQuery] = useState("");
  const [longitudeQuery, setLongitudeQuery] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const handleLatitudeChange = (event) => {
    setLatitudeQuery(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitudeQuery(event.target.value);
  };

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleDepositFormSubmit = async (event) => {
    event.preventDefault();

    // Perform any form validation here (e.g., check if latitude and longitude are valid)

    // Call the function to handle the form submission (e.g., send a transaction)
    console.log("attempting to deposit credits...");
    const { status } = await depositTokens(tokenAmount, address);
    setStatus(status);

    // Optionally, reset the form fields after submission
    setTokenAmount("");
  };

  const amount_sent = "0.0001";

  const handleBuyLandFormSubmit = (event) => {
    event.preventDefault();

    // Perform any form validation here (e.g., check if latitude and longitude are valid)

    // Call the function to handle the form submission (e.g., send a transaction)
    handleBuyLandArea(latitudeQuery, longitudeQuery, amount_sent);

    // Optionally, reset the form fields after submission
    setLatitudeQuery("");
    setLongitudeQuery("");
  };

  const handleBuyLandArea = async (_latitude, _longitude, amount_sent) => {
    // Your logic to send the transaction or perform actions with the form data
    console.log("Latitude:", _latitude);
    console.log("Longitude:", _longitude);
    // Example: send the transaction using window.ethereum.request and eth_sendTransaction
    // ... (refer to the previous example for sending a transaction)

    console.log("attempting to buy land...");
    const { status } = await buyLand(
      _latitude,
      _latitude,
      address,
      amount_sent
    );
    setStatus(status);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Perform any form validation here (e.g., check if latitude and longitude are valid)

    // Call the function to handle the form submission (e.g., send a transaction)
    handleQueryLandArea(latitudeQuery, longitudeQuery);

    // Optionally, reset the form fields after submission
    setLatitudeQuery("");
    setLongitudeQuery("");
  };

  const handleQueryLandArea = async (_latitude, _longitude) => {
    // Your logic to send the transaction or perform actions with the form data
    console.log("Latitude:", _latitude);
    console.log("Longitude:", _longitude);
    // Example: send the transaction using window.ethereum.request and eth_sendTransaction
    // ... (refer to the previous example for sending a transaction)

    const landInfo = await getLandInfo(_latitude, _longitude);
    const owner = landInfo.owner;
    setOwner(owner);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Location App - Hamzah
          </h1>
          <button
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              borderRadius: "0.25rem",
            }}
            onClick={getLocation}
          >
            Get My Location
          </button>
          {location && (
            <div style={{ marginTop: "1rem" }}>
              <h3>Location from browser</h3>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3B82F6", textDecoration: "underline" }}
                >
                  Open Maps
                </a>
              </p>
            </div>
          )}
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Owned square (manual): [2,2]
          </h2>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Manual set location
          </h2>
          <button
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              borderRadius: "0.25rem",
            }}
            onClick={() => {
              getLocationManual("0,0");
              onLocationUpdate(0, 0);
            }}
          >
            (0,0)
          </button>
          <button
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              borderRadius: "0.25rem",
            }}
            onClick={() => {
              getLocationManual("1,1");
              onLocationUpdate(1, 1);
            }}
          >
            (1,1)
          </button>
          <button
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              borderRadius: "0.25rem",
            }}
            onClick={() => {
              getLocationManual("2,2");
              onLocationUpdate(2, 2);
            }}
          >
            (2,2)
          </button>
          <p>Location set manually: {manualLocation}</p>
          <p>Location retrieved from chain: {userInfo}</p>
          <p>Message test: {message}</p>
          <p>userCredit balance: {balance}</p>
          <button onClick={onUpdatePressed}>test button</button>
          <p>Status: {status}</p>
          <button
            onClick={(e) => {
              onCreditDeposit(10);
            }}
          >
            Deposit 10 tokens
          </button>
          <p>Status: {status}</p>
          <button
            onClick={(e) => {
              onLandBuy(10, 10, "0.0001");
            }}
          >
            Buy Land at (10,10)
          </button>
          <h4>Buy land</h4>
          <form onSubmit={handleBuyLandFormSubmit}>
            <div>
              <label htmlFor="latitude">Latitude:</label>
              <input
                type="number"
                id="latitude"
                value={latitudeQuery}
                onChange={handleLatitudeChange}
                required
              />
            </div>
            <div>
              <label htmlFor="longitude">Longitude:</label>
              <input
                type="number"
                id="longitude"
                value={longitudeQuery}
                onChange={handleLongitudeChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
            <p>Status: {status}</p>
          </form>

          <h4>Query land owner</h4>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="latitude">Latitude:</label>
              <input
                type="number"
                id="latitude"
                value={latitudeQuery}
                onChange={handleLatitudeChange}
                required
              />
            </div>
            <div>
              <label htmlFor="longitude">Longitude:</label>
              <input
                type="number"
                id="longitude"
                value={longitudeQuery}
                onChange={handleLongitudeChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
            <p>Owner: {owner}</p>
          </form>
          <h4>Deposit tokens</h4>
          <form onSubmit={handleDepositFormSubmit}>
            <div>
              <label htmlFor="token_amount">Amount:</label>
              <input
                type="number"
                id="token_amount"
                value={tokenAmount}
                onChange={handleTokenAmountChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hamzah;
