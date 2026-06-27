"use client";

import { useEffect, useState } from "react";


export default function Home() {

  const OFFICE = {
    latitude:   17.33563195085764,
    longitude: 76.85610010687031,
    radius: 100
  };
  

  const [location,setLocation] = useState({
    latitude:"",
    longitude:"",
    accuracy:"",
    distance:"",
    status:"Checking..."
  });



  function calculateDistance(
    lat1:number,
    lon1:number,
    lat2:number,
    lon2:number
  ){

    const R = 6371000;


    const dLat =
    (lat2-lat1)*Math.PI/180;


    const dLon =
    (lon2-lon1)*Math.PI/180;


    const a =
    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180)
    *
    Math.cos(lat2*Math.PI/180)
    *
    Math.sin(dLon/2)
    *
    Math.sin(dLon/2);


    const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    );


    return R*c;

  }



  useEffect(()=>{


    const watcher =
    navigator.geolocation.watchPosition(

      (position)=>{


        const lat =
        position.coords.latitude;


        const lng =
        position.coords.longitude;


        const distance =
        calculateDistance(
          lat,
          lng,
          OFFICE.latitude,
          OFFICE.longitude
        );


        setLocation({

          latitude:lat.toFixed(6),

          longitude:lng.toFixed(6),

          accuracy:
          Math.round(
          position.coords.accuracy
          ).toString(),

          distance:
          Math.round(distance).toString(),


          status:
          distance <= OFFICE.radius
          ?
          "INSIDE OFFICE ✅"
          :
          "OUTSIDE OFFICE ❌"

        });


      },


      ()=>{
        setLocation(prev=>({
          ...prev,
          status:"Location permission denied"
        }))
      },


      {
        enableHighAccuracy:true
      }


    );


    return ()=>{
      navigator.geolocation.clearWatch(watcher);
    }


  },[]);



  return (

    <div style={{
      padding:"30px",
      fontFamily:"Arial"
    }}>


      <h1>
        Location Punch Test
      </h1>


      <p>
        Latitude:
        <b>{location.latitude}</b>
      </p>


      <p>
        Longitude:
        <b>{location.longitude}</b>
      </p>


      <p>
        Accuracy:
        <b>{location.accuracy} meters</b>
      </p>


      <p>
        Distance:
        <b>{location.distance} meters</b>
      </p>


      <h2 style={{
        color:
        location.status.includes("INSIDE")
        ?
        "green"
        :
        "red"
      }}>
        {location.status}
      </h2>


    </div>

  );

}
