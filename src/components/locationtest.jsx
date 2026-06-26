"use client";

import { useEffect, useState } from "react";


export default function LocationTest(){


const OFFICE = {
 latitude:12.971600,
 longitude:77.594600,
 radius:100
};


const [location,setLocation] = useState({
 latitude:"",
 longitude:"",
 accuracy:"",
 distance:"",
 status:"Checking..."
});



function calculateDistance(
 lat1,
 lon1,
 lat2,
 lon2
){

const R = 6371000;


const dLat =
(lat2-lat1)
*
Math.PI/180;


const dLon =
(lon2-lon1)
*
Math.PI/180;



const a =
Math.sin(dLat/2)
*
Math.sin(dLat/2)

+

Math.cos(
lat1*Math.PI/180
)
*
Math.cos(
lat2*Math.PI/180
)
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


if(!navigator.geolocation){

alert("GPS not supported");
return;

}



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

latitude:
lat.toFixed(6),


longitude:
lng.toFixed(6),


accuracy:
Math.round(
position.coords.accuracy
),


distance:
Math.round(distance),


status:
distance <= OFFICE.radius
?
"INSIDE OFFICE ✅"
:
"OUTSIDE OFFICE ❌"


});


},


(error)=>{

console.log(error);


setLocation(prev=>({
...prev,
status:"Location permission denied"
}));

},


{
enableHighAccuracy:true,
timeout:10000,
maximumAge:0
}


);



return ()=>{

navigator.geolocation.clearWatch(
watcher
);

};


},[]);



return (

<div className="p-5">

<h1 className="text-2xl font-bold">
Location Punch Test
</h1>


<div className="mt-5 space-y-3">


<p>
Latitude :
<b>{location.latitude}</b>
</p>


<p>
Longitude :
<b>{location.longitude}</b>
</p>


<p>
GPS Accuracy :
<b>
{location.accuracy} meters
</b>
</p>


<p>
Distance From Office :
<b>
{location.distance} meters
</b>
</p>


<h2
className={
location.status.includes("INSIDE")
?
"text-green-600"
:
"text-red-600"
}
>

{location.status}

</h2>


</div>


</div>

);


}