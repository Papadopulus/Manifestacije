import React, { useState, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '500px',
};
const center = {
    lat: 43.87247349255261,
    lng: 20.81936257123989,
};

export default function Map( props ) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyB_2zQIks5X-7AxbU2ypzQD8WSf0YQxKsU',
        libraries,
    });

    const [marker, setMarker] = useState(null);
    const [selected, setSelected] = useState(null);

    const onMapClick = (e) => {
        setMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            time: new Date(),
        });
        props.setMarker(
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            }
        )
        console.log("Lat: ", e.latLng.lat(), "Lng: ", e.latLng.lng());
    };

    let mapRef = useRef();
    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading Maps';

    return (
        <>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                options={{ disableDefaultUI: true }}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {marker && (
                    <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => {
                            setSelected(marker);
                        }}
                    />
                )}
            </GoogleMap>
        </>
    );
}


// import React, { useState, useCallback, useRef } from 'react';
// import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import usePlacesAutocomplete, {
//     getGeocode,
//     getLatLng,
// } from 'use-places-autocomplete';
// import {
//     Combobox,
//     ComboboxInput,
//     ComboboxPopover,
//     ComboboxList,
//     ComboboxOption,
// } from '@reach/combobox';
//
// const libraries = ['places'];
// const mapContainerStyle = {
//     width: '400px',
//     height: '400px',
// };
// const center = {
//     lat: 42.3601,
//     lng: -71.0589,
// };
//
// export default function Map() {
//     const { isLoaded, loadError } = useLoadScript({
//         googleMapsApiKey: 'AIzaSyB_2zQIks5X-7AxbU2ypzQD8WSf0YQxKsU',
//         libraries,
//     });
//
//     const [marker, setMarker] = useState(null);
//     const [selected, setSelected] = useState(null);
//
//     // const onMapClick = useCallback((e) => {
//     //     setMarker({
//     //         lat: e.latLng.lat(),
//     //         lng: e.latLng.lng(),
//     //         time: new Date(),
//     //     });
//     //     console.log("Lat: ", e.latLng.lat(), "Lng: ", e.latLng.lng());
//     // }, []);
//     //
//     // const mapRef = useRef();
//     // const onMapLoad = useCallback((map) => {
//     //     mapRef.current = map;
//     // }, []);
//     //
//     // const panTo = useCallback(({ lat, lng }) => {
//     //     mapRef.current.panTo({ lat, lng });
//     //     mapRef.current.setZoom(14);
//     // }, []);
//     const onMapClick = (e) => {
//         setMarker({
//             lat: e.latLng.lat(),
//             lng: e.latLng.lng(),
//             time: new Date(),
//         });
//         console.log("Lat: ", e.latLng.lat(), "Lng: ", e.latLng.lng());
//     };
//
//     let mapRef = useRef();
//     const onMapLoad = (map) => {
//         mapRef.current = map;
//     };
//
//     const panTo = ({ lat, lng }) => {
//         mapRef.current.panTo({ lat, lng });
//         mapRef.current.setZoom(14);
//     };
//
//     if (loadError) return 'Error loading maps';
//     if (!isLoaded) return 'Loading Maps';
//
//     return (
//         <div>
//             <Search panTo={panTo} />
//             <GoogleMap
//                 id="map"
//                 mapContainerStyle={mapContainerStyle}
//                 zoom={8}
//                 center={center}
//                 options={{ disableDefaultUI: true }}
//                 onClick={onMapClick}
//                 onLoad={onMapLoad}
//             >
//                 {marker && (
//                     <Marker
//                         key={`${marker.lat}-${marker.lng}`}
//                         position={{ lat: marker.lat, lng: marker.lng }}
//                         onClick={() => {
//                             setSelected(marker);
//                         }}
//                     />
//                 )}
//             </GoogleMap>
//         </div>
//     );
// }
//
// // ...existing code above...
//
// function Search({ panTo }) {
//     const {
//         ready,
//         value,
//         suggestions: { status, data },
//         setValue,
//         clearSuggestions,
//     } = usePlacesAutocomplete({
//         requestOptions: {
//             location: { lat: () => 42.3601, lng: () => -71.0589 },
//             radius: 200 * 1000,
//         },
//     });
//
//     return (
//         <div className="search">
//             <Combobox
//                 onSelect={async (address) => {
//                     setValue(address, false);
//                     clearSuggestions();
//
//                     try {
//                         const results = await getGeocode({ address });
//                         const { lat, lng } = await getLatLng(results[0]);
//                         panTo({ lat, lng });
//                     } catch (error) {
//                         console.log("Error: ", error);
//                     }
//                 }}
//             >
//                 <ComboboxInput
//                     value={value}
//                     onChange={(e) => {
//                         setValue(e.target.value);
//                     }}
//                     disabled={!ready}
//                     placeholder="Enter an address"
//                 />
//                 <ComboboxPopover>
//                     <ComboboxList>
//                         {status === "OK" &&
//                             data.map(({ id, description }) => (
//                                 <ComboboxOption key={id} value={description} />
//                             ))}
//                     </ComboboxList>
//                 </ComboboxPopover>
//             </Combobox>
//         </div>
//     );
// }
//
