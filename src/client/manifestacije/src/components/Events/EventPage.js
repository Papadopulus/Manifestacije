import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import classes from "./EventPage.module.css";
import { Button } from "../Navbar/NavButton";
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
    return (
      <div className={classes.loaderHandler}>
        <div className={classes.loader}></div>
      </div>
    );
  }
  function buyTicket() {
    console.log(event.ticketUrl);
    window.location.replace(`${event.ticketUrl}`);
  }
  return (
    <>
      <div className={classes.container}>
        <div className={classes.imageGrid}>
          <img src={event.imageUrls} alt="" className={classes.image} />
        </div>

        <div className={classes.header}>
          <h1 className={classes.title}>{event.title}</h1>
          {/*<div className={classes.date}>
            <i className="fa-solid fa-calendar-days"></i>
            {format(new Date(event.startingDate), "dd.MMM.yyyy")} -
            {format(new Date(event.endingDate), "dd.MMM.yyyy")}
          </div>*/}
        </div>
      </div>
      <div className={classes.description}>
        <h1 className={classes.descriptionTitle}>O manifestaciji</h1>
        <p>{event.description}</p>
      </div>
      <div className={classes.ticket}>
        <h1 className={classes.descriptionTitle}>Ulaznice</h1>
        <div className={classes.ticketLook}>
          <p>Cena ulaznice</p>
          <p>{event.ticketPrice}</p>
          <Button onClick={buyTicket}>Kupi ulaznicu</Button>
        </div>
      </div>
      <div className={classes.details}>
        <h1 className={classes.descriptionTitle}>Detalji o manifestaciji</h1>
        <div className={classes.detailsWrapper}>
          <div className={classes.leftDetails}>
            <ul>
              <li className={classes.date}>
                <div className={classes.dateIcon}>
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div className={classes.dateTitle}>
                  <p>DATUM</p>
                  {format(new Date(event.startingDate), "dd.MMM.yyyy")} -
                  {format(new Date(event.endingDate), "dd.MMM.yyyy")}
                </div>
              </li>
              <li className={classes.location}>
                <div className={classes.locationIcon}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className={classes.locationTitle}>
                  <p>MESTO</p>
                  {event.location.name}
                </div>
              </li>
              <li className={classes.exactLocation}>
                <div className={classes.exactLocationIcon}>
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <div className={classes.exactLocationTitle}>
                  <p>ULICA</p>
                  {event.street}
                </div>
              </li>
              <li className={classes.category}>
                <div className={classes.categoryIcon}>
                  <i className="fa-solid fa-bars"></i>
                </div>
                <div className={classes.categoryTitle}>
                  <p>KATEGORIJA</p>
                  {/* {event.category.name}*/}
                </div>
              </li>
            </ul>
          </div>
          <div className={classes.rightDetails}>
            <ul>
              <li className={classes.org}>
                <div className={classes.orgIcon}>
                  <i className="fas fa-id-card"></i>
                </div>
                <div className={classes.orgTitle}>
                  <p>ORGANIZATOR</p>
                  {event.organization.name}
                </div>
              </li>
              <li className={classes.guest}>
                <div className={classes.guestIcon}>
                  <i className="fa fa-user-plus"></i>
                </div>
                <div className={classes.guestTitle}>
                  <p>GOSTI</p>
                  <div className={classes.guestList}>
                    {event.guests.map((guest, index) => {
                      if (index === event.guests.length - 1) {
                        return <p key={index}>{guest}</p>;
                      } else {
                        return <p key={index}>{guest},</p>;
                      }
                    })}
                  </div>
                </div>
              </li>
              <li className={classes.comp}>
                <div className={classes.compIcon}>
                  <i className="fa-solid fa-ranking-star"></i>
                </div>
                <div className={classes.compTitle}>
                  <p>TAKMICARI</p>
                  <div className={classes.compList}>
                    {event.competitors.map((competitor, index) => {
                      if (index === event.guests.length - 1) {
                        return <p key={index}>{competitor}</p>;
                      } else {
                        return <p key={index}>{competitor}, </p>;
                      }
                    })}
                  </div>
                </div>
              </li>
              <li className={classes.capacity}>
                <div className={classes.capacityIcon}>
                  <i className="fa-solid fa-people-roof"></i>
                </div>
                <div className={classes.capacityTitle}>
                  <p>KAPACITET</p>
                  {event.capacity}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={classes.sponsor}>
        <h1 className={classes.sponsorTitle}>Sponzor</h1>
        {event.sponsors}
      </div>
    </>
  );
}

export default EventPage;
