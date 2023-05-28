import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import classes from "./EventHorizontal.module.css"
import {format} from "date-fns";

const EventHorizontal = ({event}) => {

    const [images, setImages] = useState(null);
    const shouldLog = useRef(true);
    const loadImage = async () => {
        try {
            const imageResponse = await axios.get(`https://localhost:7085/Image/${event.imageUrls[0]}`, {responseType: 'blob'});
            const reader = new FileReader();
            reader.onloadend = function () {
                setImages(reader.result);
            }
            reader.readAsDataURL(imageResponse.data);
        } catch (error) {
            console.error('Error retrieving the image:', error);
        }
    };

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            loadImage();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])
    return (
        
        <div className={classes.mainContainer}>
            <div className={classes.imageHolder}>
                <p>{event.title}</p>
                {images ? (
                    <img className={classes.imagePlace} src={images} alt=""/>
                ) : (
                    <span>Loading image...</span>
                )}
            </div>
            
            <div className={classes.iconItems}>

                <div>
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>Datum</span>
                </div>

                <div>
                    <div className={classes["footer-data"]}>
                        {format(new Date(event.startingDate), "dd.MMM.yyyy")} -
                        {format(new Date(event.endingDate), "dd.MMM.yyyy")}
                    </div>
                </div>

                <div>
                    <i className="fa fa-ticket" aria-hidden="true"></i>
                    <span>Ulaznica</span>
                </div>

                <div>
                    <div className={classes["footer-data"]}>
                        {event.ticketPrice} rsd
                    </div>
                </div>

                <div>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>Lokacija</span>
                </div>

                <div>
                    <div className={classes["footer-data"]}>{event.location.name}</div>
                </div>
                
            </div>
            
        </div>
    )
}
export default EventHorizontal;