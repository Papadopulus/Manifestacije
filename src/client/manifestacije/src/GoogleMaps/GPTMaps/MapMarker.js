import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 43.87247349255261,
  lng: 20.81936257123989,
};

export default function Map({ markerLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB_2zQIks5X-7AxbU2ypzQD8WSf0YQxKsU",
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  /*console.log(markerLocation)*/

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={markerLocation}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {markerLocation && (
        <MarkerF
          key={`${markerLocation.lat}-${markerLocation.lng}`}
          position={{ lat: markerLocation.lat, lng: markerLocation.lng }}
        />
      )}
    </GoogleMap>
  );
}
