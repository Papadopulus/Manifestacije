import React from "react";
import classes from "./EventList.module.css";
import Event from "./Event";
function EventList({ events }) {
  return (
    <div className={classes["list-wrap"]}>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
