import React from "react";
import classes from "./Event.module.css";
import { format } from "date-fns";
function Event({ event }) {
  function onClickEventHandler() {
    console.log("Jebem");
  }

  return (
    <div className={classes["listItem-wrap"]}>
      <img src={event.imageUrls} alt="" onClick={onClickEventHandler} />
      <header>
        <h4>{event.title}</h4>
      </header>

      <footer>
        <b>
          <i className="fa fa-calendar" aria-hidden="true"></i>
          {format(new Date(event.startingDate), "dd-MMMM")}-
          {format(new Date(event.endingDate), "dd-MMMM")} (
          {format(new Date(event.endingDate), "yyyy")})
        </b>

        <p>
          <b>
            <i className="fa fa-ticket" aria-hidden="true"></i> $
            {event.ticketPrice}
            rsd
          </b>
        </p>
      </footer>
      <div className={classes["listItem-description"]}>
        <p>
          <b>Opis:</b>
        </p>
        <p>{event.description}</p>
      </div>
    </div>
  );
}

export default Event;
