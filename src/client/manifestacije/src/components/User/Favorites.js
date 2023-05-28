import Event from "../Events/Event"
import {useEffect, useState} from "react";
import axios from "axios";
const Favorites = () => {
    const [event,setEvent] = useState(null)
    useEffect( () => {
        getEvent();
    },[])
    const getEvent = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/64723bde4d48f02f28eae410`);
        setEvent(response.data);
        console.log(response.data);
    }
    return (
        <>
            <div>
                <Event event={event}></Event>
            </div>
        </>
    )
}
export default Favorites;