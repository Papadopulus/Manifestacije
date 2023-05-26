import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import classes from "./EventPage.module.css";
import { format } from "date-fns";

function EventPage() {
  const { id } = useParams();
  const shouldLog = useRef(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/events/${id}`)
        .then((response) => {
          setEvent(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.imageGrid}>
        <img src={event.imageUrls} alt="" className={classes.image} />
      </div>

      <div className={classes.header}>
        <h1 className={classes.title}>{event.title}</h1>
        <div className={classes.date}>
          <i className="fa-solid fa-calendar-days"></i>
          {format(new Date(event.startingDate), "dd.MMM.yyyy")} -
          {format(new Date(event.endingDate), "dd.MMM.yyyy")}
        </div>

        <div className={classes.description}>
          <h1 className={classes.descriptionTitle}>Opis manifestacije</h1>
          <p>{event.description}</p>
        </div>
        <div className={classes.guesCompWrapper}>
          <div className={classes.guest}>
            <h1 className={classes.descriptionTitle}>Gosti</h1>
            {event.guests.map((guest) => (
              <p>{guest}</p>
            ))}
          </div>
          <div className={classes.competitors}>
            <h1 className={classes.descriptionTitle}>Takmicari</h1>
            {event.competitors.map((competitor) => (
              <p>{competitor}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
