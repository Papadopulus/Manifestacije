import React from "react";
import classes from "./Event.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./Event.css";
function Event({ event }) {
  const navigate = useNavigate();
  function onClickEventHandler() {
    navigate("/events/" + event.id);
  }

  return (
    <div className={classes["listItem-wrap"]} onClick={onClickEventHandler}>
      <img src={event.imageUrls} alt="" />

      <header>
        <h4>{event.title}</h4>
      </header>

      <footer className={classes["footer"]}>
        <div className={classes["footer-left"]}>
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
            <i className="fas fa-map-marked-alt"></i>
            <span>Lokacija</span>
          </div>
          <div>
            <div className={classes["footer-data"]}>{event.location.name}</div>
          </div>
        </div>
        <div className={classes["footer-right"]}>
          <div>
            <i className="fa fa-ticket" aria-hidden="true"></i>
            <span>Ulaznica</span>
          </div>
          <div>
            <div className={classes["footer-data"]}>
              💲{event.ticketPrice} rsd
            </div>
          </div>
          <div>
            <i className="fa fa-users" aria-hidden="true"></i>
            <span>Kapacitet</span>
          </div>
          <div>
            <div className={classes["footer-data"]}>{event.capacity}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Event;
