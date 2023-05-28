import React, {useEffect, useState} from "react";
import classes from "./Event.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import axios from "axios";
function Event({ event }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSponsoredInfo, setShowSponsoredInfo] = useState(false);
  const [showFavoritesInfo, setShowFavoritesInfo] = useState(false);
  const [images, setImages] = useState('');

  const loadImage = async () => {
    try {
      const imageResponse = await axios.get(`https://localhost:7085/Image/${event.imageUrls[0]}`, { responseType: 'blob' });
      const reader = new FileReader();
      reader.onloadend = function() {
        setImages(reader.result);
      }
      reader.readAsDataURL(imageResponse.data);
    } catch (error) {
      console.error('Error retrieving the image:', error);
    }
  };
  useEffect( () => {
            loadImage();
        },[])
  function onClickEventHandler() {
    navigate("/events/" + event.id);
  }
  function toggleFavorite() {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    console.log(event.title);
  }
  return (
    <div className={classes["listItem-wrap"]} onClick={onClickEventHandler}>
      {/*{event.sponsored && (*/}
        <div
          className={classes.sponsoredIcon}
          onMouseEnter={() => setShowSponsoredInfo(true)}
          onMouseLeave={() => setShowSponsoredInfo(false)}
        >
          <i className="fa-solid fa-hand-holding-dollar"></i>
          {showSponsoredInfo && (
            <div className={classes.sponsoredInfo}>
              This event is sponsored by{" "}
              {event.sponsors.map((sponsor, index) => (
                <span key={sponsor}>
                  {sponsor}
                  {index !== event.sponsors.length - 1 && <span>, </span>}
                </span>
              ))}
              {event.sponsors.length > 1 && <span>&nbsp;</span>}!
            </div>
          )}
        </div>
      {/*)}*/}
      <div
        className={`${classes.favoriteIcon} ${
          isFavorite ? classes.favorite : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        onMouseEnter={() => setShowFavoritesInfo(true)}
        onMouseLeave={() => setShowFavoritesInfo(false)}
      >
        {isFavorite ? (
          <i className="fa-solid fa-star"></i>
        ) : (
          <i className="fa-regular fa-star"></i>
        )}
        {showFavoritesInfo && (
          <div className={classes.favoritesInfo}>Add to favourites!</div>
        )}
      </div>
      <img src={images} alt="" />

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
              {event.ticketPrice} rsd
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
