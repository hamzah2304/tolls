import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { icon } from "leaflet";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./Navbar.css";

import ModalWithButton from "./components/ModalWithButton";
import Modal from "./components/Modal";

import { useSigner, useAccount } from "wagmi";

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

const ICON = icon({
  iconUrl: "/person-marker.png",
  iconSize: [32, 32],
});

const Map = ({
  purchaseModalOpenState,
  tollModalOpenState,
  readYourselfModalOpenState,
  readOtherModalOpenState,
  ownedState,
}) => {
  console.log(purchaseModalOpenState);
  let [purchaseModalOpen, setPurchaseModalOpen] = purchaseModalOpenState;
  let [owned, setOwned] = ownedState;
  let [readYourselfModalOpen, setReadYourselfModalOpen] =
    readYourselfModalOpenState;
  let [readOtherModalOpen, setReadOtherModalOpen] = readOtherModalOpenState;
  let [tollModalOpen, setTollModalOpen] = tollModalOpenState;

  const [balance, setBalance] = useState("No balance retrieved");
  const [userInfo, setUserInfo] = useState();
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const { address } = useAccount();

  console.log("Toby component is rendering");

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [lastLoc, setLastLoc] = useState({
    coorLat: null,
    coorLng: null,
  });

  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  let setInitLoc = false;

  const [rectangleSets, setRectangleSets] = useState([]);

  let [onloadOrigin, setOnloadOrigin] = useState({});

  //
  // const ownedRef = useRef(owned);
  // const setOwned = (newOwned) => {
  //   ownedRef.current = newOwned;
  //   _setOwned(newOwned);
  // };

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

  function initLocTransaction(ownership, lat, lng) {
    if (ownership == "other") {
      setTollModalOpen({ open: true });
      console.log("location + pay toll");
    } else {
      console.log("just location");
    }
  }

  // ---------------------------------------------

  const amount_sent = "0.0001";
  const onLandBuy = async (_latitude, _longitude, amount_sent) => {
    console.log("attempting to buy land...");
    console.log("Latitude:", _latitude);
    console.log("Longitude:", _longitude);
    const { status } = await buyLand(
      _latitude,
      _longitude,
      address,
      amount_sent
    );
    setStatus(status);
  };

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleDepositFormSubmit = async (tokenAmount) => {
    // Call the function to handle the form submission (e.g., send a transaction)
    console.log("attempting to deposit credits...");
    const { status } = await depositTokens(tokenAmount, address);
    setStatus(status);

    // Optionally, reset the form fields after submission
    setTokenAmount("");
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

  async function getBalance() {
    const retrievedBalance = await getUserCredit(
      "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
    );
    setBalance(retrievedBalance);
  }

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

  useEffect(() => {
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
    retrieveUserInfo();
    addSmartContractListener();
  }, []);

  useEffect(() => {
    console.log("changed", onloadOrigin);
    setLastLoc({ coorLat: 0, coorLng: 0 });
    initLocTransaction(owned[0][0], 0, 0);
  }, [onloadOrigin]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      //       const watchId = navigator.geolocation.watchPosition((position) => {
      //         console.log('hey');
      //         setLocation({
      //           latitude: position.coords.latitude,
      //           longitude: position.coords.longitude,
      //         });
      //         console.log(position.coords)
      //       });
      //
      //       // Cleanup function to stop watching the user's location when the component unmounts
      //       return () => navigator.geolocation.clearWatch(watchId);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("loc original", position);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocationLoaded(true);
        },
        (error) => {
          alert("Unable to retrieve your location.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    setInterval(function () {
      if (lastLoc.coorLat != null && lastLoc.coorLng != null) {
        console.log(`5 sec location refresh`);
        if (navigator.geolocation) {
          console.log("start get loc 5sec");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("loc 5 sec", position);
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              let newLoc = determineLatticeCoor(position.coords, 10);
              console.log(newLoc, lastLoc);
              if (
                newLoc.coorLat != lastLoc.coorLat ||
                newLoc.coorLng != lastLoc.coorLng
              ) {
                setLastLoc(newLoc);
                initLocTransaction(
                  owned[newLoc.coorLng][newLoc.coorLat],
                  newLoc.coorLat,
                  newLoc.coorLng
                );
              }
            },
            (error) => {
              alert("Unable to retrieve your location.");
              console.error(error);
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }
    }, 5000);
  }, [lastLoc]);

  // useEffect(() => {
  //   console.log("use", lastLoc);
  //   if (lastLoc.coorLat != null && lastLoc.coorLng != null) {
  //     function handleKeyPress(event) {
  //       console.log(`Pressed key: ${event.key}`);
  //       if (event.key === "r") {
  //         if (navigator.geolocation) {
  //           console.log("start get loc r");
  //           navigator.geolocation.getCurrentPosition(
  //             (position) => {
  //               console.log("loc r", position);
  //               setLocation({
  //                 latitude: position.coords.latitude,
  //                 longitude: position.coords.longitude,
  //               });
  //               let newLoc = determineLatticeCoor(position.coords, 10);
  //               console.log(newLoc, lastLoc);
  //               if (
  //                 newLoc.coorLat != lastLoc.coorLat ||
  //                 newLoc.coorLng != lastLoc.coorLng
  //               ) {
  //                 setLastLoc(newLoc);
  //                 initLocTransaction(owned[newLoc.coorLng][newLoc.coorLat]);
  //               }
  //             },
  //             (error) => {
  //               alert("Unable to retrieve your location.");
  //               console.error(error);
  //             }
  //           );
  //         } else {
  //           alert("Geolocation is not supported by this browser.");
  //         }
  //       }
  //     }

  //     // Add the keypress event listener to the window
  //     window.addEventListener("keypress", handleKeyPress);

  //     // Make sure to cleanup the listener when the component is unmounted
  //     return () => {
  //       window.removeEventListener("keypress", handleKeyPress);
  //     };
  //   } else {
  //     console.log("too early to refresh loc");
  //   }
  // }, [lastLoc]); // Empty array means this effect runs once on mount and cleanup on unmount

  // <div className="flex justify-center items-center h-screen">
  //   <div>
  //     <h1 className="text-3xl font-bold mb-4">Location App</h1>
  //     <button
  //       className="px-4 py-2 bg-blue-500 text-white rounded"
  //       onClick={getLocation}
  //     >
  //       Get My Location
  //     </button>
  //     {location && (
  //       <div className="mt-4">
  //         <p>Latitude: {location.latitude}</p>
  //         <p>Longitude: {location.longitude}</p>
  //         <p>
  //           <a
  //             href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="text-blue-500 underline"
  //           >
  //             Open Maps
  //           </a>
  //         </p>
  //       </div>
  //     )}
  //   </div>
  // </div>

  // <p>Latitude: {location.latitude}</p>
  // <p>Longitude: {location.longitude}</p>
  // <a
  //   href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=14/${location.latitude}/${location.longitude}`}
  //   target="_blank"
  //   rel="noopener noreferrer"
  // >
  //   Open in Maps
  // </a>

  function computeLatticeOriginPosition(point, meters) {
    return {
      coorLat: Math.floor((point.latitude * 111139) / meters),
      coorLng: Math.floor((point.longitude * 111139) / meters),
    };
  }

  function InitBottomLeftCorner(point, meters) {
    let theOrigin = computeLatticeOriginPosition(point, meters);
    setOnloadOrigin(theOrigin);
    return {
      latitude: theOrigin.coorLat / (111139 / meters),
      longitude: theOrigin.coorLng / (111139 / meters),
    };
  }

  function determineLatticeCoor(point, meters) {
    let pointCoor = computeLatticeOriginPosition(point, meters);
    return {
      coorLat: pointCoor.coorLat - onloadOrigin.coorLat,
      coorLng: pointCoor.coorLng - onloadOrigin.coorLng,
    };
  }

  function CornerPoint(point, meters, hor, ver) {
    let delta_latitude_degrees = meters / 111139;
    let delta_longitude_degrees =
      meters / (111139 * Math.cos((point.latitude / 180) * Math.PI));
    if (hor == "right" && ver == "top") {
      return {
        latitude: point.latitude + delta_latitude_degrees,
        longitude: point.longitude + delta_longitude_degrees,
      };
    } else if (hor == "left" && ver == "top") {
      return {
        latitude: point.latitude + delta_latitude_degrees,
        longitude: point.longitude - delta_longitude_degrees,
      };
    } else if (hor == "right" && ver == "down") {
      return {
        latitude: point.latitude - delta_latitude_degrees,
        longitude: point.longitude + delta_longitude_degrees,
      };
    } else if (hor == "left" && ver == "down") {
      return {
        latitude: point.latitude - delta_latitude_degrees,
        longitude: point.longitude - delta_longitude_degrees,
      };
    }
  }

  function buildRectangle(point1, meters, hor = "right", ver = "top", x, y) {
    let point2 = CornerPoint(point1, meters, hor, ver);
    return {
      bottomleft: point1,
      topright: point2,
      bottomright: { latitude: point1.latitude, longitude: point2.longitude },
      topleft: { latitude: point2.latitude, longitude: point1.longitude },
      rect: [
        [point1.latitude, point1.longitude],
        [point2.latitude, point2.longitude],
      ],
      x: x,
      y: y,
    };
  }

  useEffect(() => {
    let rects = [];
    let homeBottomLeft = InitBottomLeftCorner(location, 10);
    let xradius = Math.ceil(window.innerWidth / (2 * 104));
    let yradius = Math.ceil(window.innerHeight / (2 * 104));
    let home = buildRectangle(homeBottomLeft, 10);
    let nextxr = home;
    for (var i = 1; i <= xradius; i += 1) {
      nextxr = buildRectangle(nextxr.bottomright, 10, "right", "top", i, 0);
      rects.push(nextxr);
      let nextxryu = Object.assign({}, nextxr);
      for (var j = 1; j <= yradius; j += 1) {
        nextxryu = buildRectangle(nextxryu.topleft, 10, "right", "top", i, j);
        rects.push(nextxryu);
      }
      let nextxryd = Object.assign({}, nextxr);
      for (var j = 1; j <= yradius + 1; j += 1) {
        nextxryd = buildRectangle(
          nextxryd.topleft,
          10,
          "right",
          "down",
          i,
          1 - j
        );
        if (j > 1) rects.push(nextxryd);
      }
    }
    let nextxl = home;
    for (var i = 2; i <= xradius + 3; i += 1) {
      nextxl = buildRectangle(nextxl.bottomright, 10, "left", "top", 2 - i, 0);
      if (i > 1 && i <= xradius + 2) rects.push(nextxl);
      let nextxlyu = Object.assign({}, nextxl);
      for (var j = 1; j <= yradius; j += 1) {
        nextxlyu = buildRectangle(
          nextxlyu.topleft,
          10,
          "right",
          "top",
          3 - i,
          j
        );
        if (i > 2) rects.push(nextxlyu);
      }
      let nextxlyd = Object.assign({}, nextxl);
      for (var j = 1; j <= yradius + 1; j += 1) {
        nextxlyd = buildRectangle(
          nextxlyd.topleft,
          10,
          "right",
          "down",
          3 - i,
          1 - j
        );
        if (i > 2 && j > 1) rects.push(nextxlyd);
      }
    }
    setRectangleSets(rects);
  }, [isLocationLoaded]);

  useEffect(() => {
    console.log(owned);
  }, [owned]);

  const grayOptions = { color: "gray" };
  const greenOptions = { color: "green" };
  const redOptions = { color: "red" };

  return (
    <>
      <nav class="navbar">
        <a href="http:localhost:3000/" target={"_blank"}>
          <div>
            <h2 class="navtitle">Tolls</h2>
            {/* <img src="/tollslogo.png"/> */}
          </div>
          {/* <img className={styles.alchemy_logo} src="/cw3d-logo.png"></img> */}
        </a>
        <div className="btns-right">
          <Modal
            title={"You wanna buy this land??"}
            openstate={purchaseModalOpenState}
            successbtntext={"Buy"}
            successbtnOnClick={() => {
              onLandBuy(
                purchaseModalOpen.absx,
                purchaseModalOpen.absy,
                amount_sent
              ).then(() => {
                setOwned((prevState) => ({
                  ...prevState,
                  [purchaseModalOpen.rely]: {
                    ...(prevState[purchaseModalOpen.rely] || {}),
                    [purchaseModalOpen.relx]: "yourself",
                  },
                }));
              });
            }}
          >
            <p>Try to buy this land lol. It will cost you 100 TOLL</p>
          </Modal>
          <Modal
            title={"You own this land"}
            openstate={readYourselfModalOpenState}
          >
            <p>You own this land: {owner}</p>
          </Modal>
          <Modal
            title={"This land is owned"}
            openstate={readOtherModalOpenState}
          >
            <p>This land is owned by {owner}</p>
          </Modal>
          <Modal title={"A toll is due"} openstate={tollModalOpenState}>
            <p>You owe {10} TOLL for passing through someone's land.</p>
          </Modal>
          <ModalWithButton
            title={"Deposit TOLL Tokens"}
            btntext={"Deposit TOLL"}
            successbtntext={"Deposit"}
            successbtnOnClick={() => {
              handleDepositFormSubmit(tokenAmount);
            }}
          >
            <p>Choose amount to deposit:</p>
            <input
              type="number"
              id="token_amount"
              value={tokenAmount}
              onChange={handleTokenAmountChange}
              required
              className={"deposit-toll"}
              placeholder={`${balance} TOLL`}
            />
          </ModalWithButton>
          <ModalWithButton
            title={"TOLL Balance"}
            btnimg={"/TOLL.png"}
            btntext={`${balance} TOLL`}
          >
            <p>You have {balance} TOLL in your account</p>
            <a href="https://etherscan.io/">Check etherscan</a>
          </ModalWithButton>
          <ConnectButton></ConnectButton>
        </div>
      </nav>
      <div className="App">
        <div>
          <div
            className={
              rectangleSets.length ? "rectanglesloaded" : "rectanglesunloaded"
            }
          >
            {location.latitude && location.longitude ? (
              <div>
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={20}
                  zoomControl={false}
                  doubleClickZoom={false}
                  scrollWheelZoom={false}
                  dragging={false}
                >
                  <TileLayer
                    maxZoom={20}
                    maxNativeZoom={20}
                    url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {rectangleSets.length &&
                    rectangleSets.map((rectObj) => {
                      const currentOwned = owned;
                      let ownership = "unowned";
                      if (
                        rectObj.y in currentOwned &&
                        rectObj.x in currentOwned[rectObj.y]
                      ) {
                        ownership = currentOwned[rectObj.y][rectObj.x];
                      }
                      return (
                        <Rectangle
                          key={`${rectObj.x}-${rectObj.y}-${ownership}`}
                          bounds={rectObj.rect}
                          className={"styled-rectangle-" + ownership}
                          eventHandlers={{
                            click: () => {
                              console.log(rectObj.x, rectObj.y);
                              // alert('square is owned by: '+ownership+' ['+rectObj.x+','+rectObj.y+']')
                              console.log(
                                "send query to location: [" +
                                  parseInt(onloadOrigin.coorLat + rectObj.x) +
                                  "," +
                                  parseInt(onloadOrigin.coorLng + rectObj.y) +
                                  "]"
                              );

                              // const currentOwned = JSON.parse(JSON.stringify(ownedRef.current)); // deep copy
                              // if(!currentOwned[rectObj.y]) {
                              //   currentOwned[rectObj.y] = {};
                              // }
                              // currentOwned[rectObj.y][rectObj.x] = 'yourself';
                              if (ownership == "unowned") {
                                setPurchaseModalOpen({
                                  open: true,
                                  absx: parseInt(
                                    onloadOrigin.coorLat + rectObj.x
                                  ),
                                  absy: parseInt(
                                    onloadOrigin.coorLng + rectObj.y
                                  ),
                                  relx: rectObj.x,
                                  rely: rectObj.y,
                                });
                              } else if (ownership == "other") {
                                handleQueryLandArea(
                                  parseInt(onloadOrigin.coorLat + rectObj.x),
                                  parseInt(onloadOrigin.coorLng + rectObj.y)
                                ).then(() => {
                                  setReadOtherModalOpen({ open: true });
                                });
                              } else if (ownership == "yourself") {
                                handleQueryLandArea(
                                  parseInt(onloadOrigin.coorLat + rectObj.x),
                                  parseInt(onloadOrigin.coorLng + rectObj.y)
                                ).then(() => {
                                  setReadYourselfModalOpen({ open: true });
                                });
                              }

                              // setOwned((prevState) => ({
                              //   ...prevState,
                              //   [rectObj.y]:{
                              //     ...(prevState[rectObj.y] || {}),
                              //     [rectObj.x]:'yourself'
                              //   }
                              // }));
                            },
                          }}
                        />
                      );
                    })}
                  <Marker
                    icon={ICON}
                    position={[location.latitude, location.longitude]}
                  />
                </MapContainer>
              </div>
            ) : (
              <div className="loading-container">
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
