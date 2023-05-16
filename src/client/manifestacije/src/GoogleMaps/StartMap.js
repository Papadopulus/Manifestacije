import {useMemo, useState} from "react";
import { GoogleMap, useLoadScript, Marker ,MarkerF} from "@react-google-maps/api";
import usePlacesAutocomplete , {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete"
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox"
import "@reach/combobox/styles.css";
import "./StartMap.css";

const StartMap = () => {
    const center = useMemo(()=> ({ lat: 44, lng: -80 }),[])
    const [selected,setSelected] = useState(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyB_2zQIks5X-7AxbU2ypzQD8WSf0YQxKsU",
        libraries:["places"],
    });
    const PLacesAutoComplete = ({setSelected}) => {
        const {
            ready,
            value,
            setValue,
            suggestions: {status,data},
            clearSuggestions
        }= usePlacesAutocomplete();
        return (
            <Combobox>
                <ComboboxInput 
                    value={value} 
                    onChange={e=>setValue(e.target.value)} 
                    // disabled={!ready}
                    className={"combobox-input"}
                    placeholder={"Search an address"}
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status==="OK" && data.map(({place_id,description})=> <ComboboxOption key={place_id} value={description}/>)}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        );
    }

    return (
        <>
            
            {!isLoaded ? (
                <div>Loading...</div>
            ) : (
                <GoogleMap
                    zoom={10}
                    center={center}
                    mapContainerClassName={"map-style"}
                >
                    {/*{selected && <MarkerF position={center}/>}*/}
                    <MarkerF position={center}/>
                </GoogleMap>
            )}
            <div>
                <PLacesAutoComplete setSelected={setSelected}/>
            </div>
        </>
    );
};

export default StartMap;
