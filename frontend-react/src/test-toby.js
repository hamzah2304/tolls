import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Rectangle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

import { icon } from "leaflet"

const ICON = icon({
  iconUrl: "/person-marker.png",
  iconSize: [32, 32],
})

const Toby = ({purchaseModalOpenState, tollModalOpenState}) => {
  console.log(purchaseModalOpenState)
  let [purchaseModalOpen,setPurchaseModalOpen] = purchaseModalOpenState;
  let [tollModalOpen,setTollModalOpen] = tollModalOpenState;

  console.log('Toby component is rendering');

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  let setInitLoc = false;
  
  const [rectangleSets,setRectangleSets] = useState([]);
  
  let [onloadOrigin,setOnloadOrigin] = useState({});

  
  let [owned,_setOwned] = useState({
    0: {
      0: 'other',
      1: 'yourself',
      2: 'other',
    },
    1: {
      '-1': 'yourself',
      0: 'yourself',
      1: 'yourself',
      2: 'other',
      3: 'other',
    },
    2: {
      0: 'other',
      1: 'other',
    }
  });
  const ownedRef = useRef(owned);
  const setOwned = (newOwned) => {
    ownedRef.current = newOwned;
    _setOwned(newOwned);
  };

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
        console.log(position.coords)
      });

      // Cleanup function to stop watching the user's location when the component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);
  
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

  function InitBottomLeftCorner(point,meters){
    let origin = {coorLat:Math.floor(point.latitude*111139/meters),coorLng:Math.floor(point.longitude*111139/meters)};
    setOnloadOrigin(origin)
    return {latitude:origin.coorLat/(111139/meters),longitude:origin.coorLng/(111139/meters)};
  }
  
  function CornerPoint(point,meters,hor,ver){
    let delta_latitude_degrees = meters / 111139;
    let delta_longitude_degrees = meters / (111139 * Math.cos(point.latitude/180*Math.PI));
    if (hor=="right"&&ver=="top"){
      return {latitude:point.latitude+delta_latitude_degrees,longitude:point.longitude+delta_longitude_degrees}
    } else if (hor=="left"&&ver=="top"){
      return {latitude:point.latitude+delta_latitude_degrees,longitude:point.longitude-delta_longitude_degrees}
    } else if (hor=="right"&&ver=="down"){
      return {latitude:point.latitude-delta_latitude_degrees,longitude:point.longitude+delta_longitude_degrees}
    } else if (hor=="left"&&ver=="down"){
      return {latitude:point.latitude-delta_latitude_degrees,longitude:point.longitude-delta_longitude_degrees}
    }
  }
  
  function buildRectangle(point1,meters,hor="right",ver="top",x,y){
    let point2 = CornerPoint(point1,meters,hor,ver);
    return {bottomleft:point1,topright:point2,bottomright:{latitude:point1.latitude,longitude:point2.longitude},topleft:{latitude:point2.latitude,longitude:point1.longitude},rect:[[point1.latitude,point1.longitude],[point2.latitude,point2.longitude]],x:x,y:y};
  }
  
  useEffect(()=>{
    if (!setInitLoc){
      setInitLoc = true;
      let rects = [];
      let homeBottomLeft = InitBottomLeftCorner(location,10);
      console.log('onloadOrigin',onloadOrigin)
      let xradius = Math.ceil(window.innerWidth/(2*104));
      let yradius = Math.ceil(window.innerHeight/(2*104));
      let home = buildRectangle(homeBottomLeft,10);
      let nextxr = home;
      for (var i=1;i<=xradius;i+=1){
        nextxr = buildRectangle(nextxr.bottomright,10,"right","top",i,0);
        rects.push(nextxr)
        let nextxryu = Object.assign({}, nextxr);
        for (var j=1;j<=yradius;j+=1){
          nextxryu = buildRectangle(nextxryu.topleft,10,"right","top",i,j);
          rects.push(nextxryu)
        }
        let nextxryd = Object.assign({}, nextxr);
        for (var j=1;j<=yradius+1;j+=1){
          nextxryd = buildRectangle(nextxryd.topleft,10,"right","down",i,1-j);
          if (j>1) rects.push(nextxryd)
        }
      }
      let nextxl = home;
      for (var i=2;i<=xradius+3;i+=1){
        nextxl = buildRectangle(nextxl.bottomright,10,"left","top",2-i,0);
        if (i>1 && i<=xradius+2) rects.push(nextxl)
        let nextxlyu = Object.assign({}, nextxl);
        for (var j=1;j<=yradius;j+=1){
          nextxlyu = buildRectangle(nextxlyu.topleft,10,"right","top",3-i,j);
          if (i>2) rects.push(nextxlyu)
        }
        let nextxlyd = Object.assign({}, nextxl);
        for (var j=1;j<=yradius+1;j+=1){
          nextxlyd = buildRectangle(nextxlyd.topleft,10,"right","down",3-i,1-j);
          if (i>2 && j>1) rects.push(nextxlyd)
        }
      }
      setRectangleSets(rects);
    }
  },[location]);
  
  useEffect(() => {
    console.log(owned)
  }, [owned]);

  
  const grayOptions = { color: 'gray' }
  const greenOptions = { color: 'green' }
  const redOptions = { color: 'red' }

  return (
    <div>
      <div className={rectangleSets.length ? "rectanglesloaded":"rectanglesunloaded"}>
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
              {rectangleSets.length && rectangleSets.map((rectObj) => {
                const currentOwned = ownedRef.current;
                let ownership = "unowned";
                if (rectObj.y in currentOwned && rectObj.x in currentOwned[rectObj.y]){
                  ownership = ownedRef.current[rectObj.y][rectObj.x];
                }
                return (<Rectangle key={`${rectObj.x}-${rectObj.y}-${ownership}`} bounds={rectObj.rect} className={"styled-rectangle-"+ownership} eventHandlers={{
                  click: ()=>{
                    console.log(rectObj.x,rectObj.y)
                    // alert('square is owned by: '+ownership+' ['+rectObj.x+','+rectObj.y+']')
                    console.log('send query to location: ['+parseInt(onloadOrigin.coorLat+rectObj.x)+','+parseInt(onloadOrigin.coorLng+rectObj.y)+']');
                    
                    const currentOwned = JSON.parse(JSON.stringify(ownedRef.current)); // deep copy
                    if(!currentOwned[rectObj.y]) {
                      currentOwned[rectObj.y] = {};
                    }
                    currentOwned[rectObj.y][rectObj.x] = 'yourself';
                    setPurchaseModalOpen(true);
                    setOwned(currentOwned);
                    // setOwned((prevState) => ({
                    //   ...prevState,
                    //   [rectObj.y]:{
                    //     ...(currentOwned[rectObj.y] || {}),
                    //     [rectObj.x]:'other'
                    //   }
                    // }));
                  },
                }}/>)
              })}
              <Marker icon={ICON} position={[location.latitude, location.longitude]} />
            </MapContainer>
          </div>
        ) : (
          <div className="loading-container">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toby;
