
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
import Event from "../Events/Event";
import classes from "./Favorites.module.css"

const Favorites = () => {
    const [event, setEvent] = useState(null)
    const shouldLog = useRef(true);

    
    const getEvent = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/647226b04d48f02f28eae3f7`);
            setEvent(response.data);
            console.log(response.data);
            
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() =>{
        if (shouldLog.current) {
            shouldLog.current = false;
            getEvent();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])

    return (
        // <div>
        <div className={classes.allEvents}>
            {event &&<EventHorizontal event={event}/>}
        </div>

    )
}
export default Favorites;