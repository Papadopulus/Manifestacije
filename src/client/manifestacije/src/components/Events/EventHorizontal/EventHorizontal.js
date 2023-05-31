import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import classes from "./EventHorizontal.module.css";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
const EventHorizontal = ({ event, user ,setEvents}) => {
  const [images, setImages] = useState(null);
  const [showFavoritesInfo, setShowFavoritesInfo] = useState(false);

  const shouldLog = useRef(true);
  const loadImage = async () => {
    try {
      const imageResponse = await axios.get(
        `https://localhost:7085/Image/${event.imageUrls[0]}`,
        { responseType: "blob" }
      );
      const reader = new FileReader();
      reader.onloadend = function () {
        setImages(reader.result);
      };
      reader.readAsDataURL(imageResponse.data);
    } catch (error) {
      console.error("Error retrieving the image:", error);
    }
  };

  const toggleFavorite = async () => {
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    try {
      await axios.delete(
        `https://localhost:7237/users/${user.Id}/events/${event.id}/favourites`,
        { headers: header }
      );
      setEvents((prevEvents) =>
          prevEvents.filter((favEvent) => favEvent.id !== event.id)
      );
    } catch (error) {
      console.error("Error performing favorite action:", error);
    }
  };

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      loadImage();
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);
  return (
    <div className={classes.mainContainer}>
      <div
        className={classes.favoriteIcon}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        onMouseEnter={() => setShowFavoritesInfo(true)}
        onMouseLeave={() => setShowFavoritesInfo(false)}
      >
        <i className="fa-solid fa-star"></i>

        {showFavoritesInfo && (
          <div className={classes.favoritesInfo}>Remove from favorites!</div>
        )}
      </div>

      <div className={classes.imageHolder}>
        {images ? (
          <img className={classes.imagePlace} src={images} alt="" />
        ) : (
          // <div className={classes.spinner}>
          //     <div className={classes.spinnerCircle}></div>
          // </div>
          <div className={classes.skeleton} />
        )}
      </div>

      <div className={classes.iconItems}>
        <div className={classes["naslov"]}>
          <p>{event.title}</p>
        </div>

        <div className={classes.divDesniUnutra}>
          <div className={classes["icon-text"]}>
            <div className={"jebo"}>
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <p>
              {format(new Date(event.startingDate), "dd.MMM.yyyy") +
                "-" +
                format(new Date(event.endingDate), "dd.MMM.yyyy")}
              {/*{event.location.name}*/}
            </p>
          </div>

          <div className={classes["icon-text"]}>
            <i className="fa-solid fa-location-dot"></i>
            <p>{event.location.name}</p>
          </div>

          <div className={classes["icon-text"]}>
            <i className="fa fa-ticket"></i>
            <p>{event.ticketPrice} RSD</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventHorizontal;
