import React from "react";
import classes from "./Event.module.css";
import { format } from "date-fns";
function Event({ event }) {
  return (
    <div className={classes["listItem-wrap"]}>
      <img src={event.imageUrls} alt="" />
      <header>
        <h4>{event.title}</h4>
        {/*<span>🌟{rating}</span>*/}
        <p>{event.description}</p>
      </header>
      <footer>
        <p>
          <b>
            {format(new Date(event.startingDate), "dd-MMMM")}-
            {format(new Date(event.endingDate), "dd-MMMM")} (
            {format(new Date(event.endingDate), "yyyy")})
          </b>
        </p>
        <p>
          <b>${event.ticketPrice}rsd</b>
        </p>
      </footer>
    </div>
  );
}

export default Event;
