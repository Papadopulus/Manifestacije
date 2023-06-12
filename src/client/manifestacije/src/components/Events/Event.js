import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Event.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./Event.css";
import axios from "axios";
import AuthContext from "../../store/AuthContext";
import NotLoggedIn from "./NotLoggedIn";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

function Event({ event, setEvents, organization }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSponsoredInfo, setShowSponsoredInfo] = useState(false);
  const [showFavoritesInfo, setShowFavoritesInfo] = useState(false);
  const [hasFavourites, setHasFavourites] = useState([]);
  const [images, setImages] = useState("");
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const { user } = useContext(AuthContext);

  const shouldLog = useRef(true);
  const loadImage = async () => {
    try {
      const imageResponse = await axios.get(
        `${process.env.REACT_APP_IMAGE_URL}/Image/${event.imageUrls[0]}`,
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
  const loadFavourites = async () => {
    await checkTokenAndRefresh();
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    try {
      const hasFavouritesResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${user.Id}/favourites`,
        { headers: header }
      );
      setHasFavourites(hasFavouritesResponse.data);
      /*console.log(hasFavouritesResponse.data);*/
    } catch (error) {
      console.error("Error retrieving the user's favourite events:", error);
    }
  };
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      loadImage();
      if (user) {
        loadFavourites();
      }
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);
  function onClickEventHandler() {
    navigate("/events/" + event.id);
  }
  const toggleFavorite = async () => {
    if (!user) {
      setNotLoggedIn(true);
    } else {
      await checkTokenAndRefresh();
      let header = {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("tokens")).token
        }`,
      };
      try {
        if (isFavorite) {
          await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/users/${user.Id}/events/${event.id}/favourites`,
            { headers: header }
          );
          if (setEvents) {
            setEvents((prevEvents) =>
              prevEvents.filter((favEvent) => favEvent.id !== event.id)
            );
          }
        } else {
          await axios.post(
            `${process.env.REACT_APP_BASE_URL}/users/${user.Id}/events/${event.id}/favourites`,
            null,
            { headers: header }
          );
        }
      } catch (error) {
        console.error("Error performing favorite action:", error);
      }

      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    }
  };
  useEffect(() => {
    // Provera da li je trenutni događaj u favoritima korisnika
    if (user) {
      let checker = false;
      /*console.log(event.title + event.id);*/
      hasFavourites.map((favourite) => {
        if (favourite.id === event.id) {
          setIsFavorite(true);
          checker = true;
        } else {
          setIsFavorite(false);
        }
      });
      if (checker === true) {
        setIsFavorite(true);
      }
    }
  }, [user, event.id, hasFavourites]);

  function handleEdit(event) {
    navigate("/editEvents/" + event.id);
  }

  return (
    <>
      {notLoggedIn && <NotLoggedIn cancel={setNotLoggedIn}></NotLoggedIn>}
      <div className={classes["listItem-wrap"]} onClick={onClickEventHandler}>
        <div
          className={classes.sponsoredIcon}
          onMouseEnter={() => setShowSponsoredInfo(true)}
          onMouseLeave={() => setShowSponsoredInfo(false)}
        >
          {/*<i className="fa-regular fa-square-info fa-2xs"></i>*/}
          <InfoOutlinedIcon />
          {showSponsoredInfo && (
            <div className={classes.sponsoredInfo}>
              Manifestaciju sponzorisao{" "}
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
        <div className={classes.editIcon}>
          {organization && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(event);
              }}
            >
              <EditIcon sx={{ fontSize: 30 }}></EditIcon>
            </IconButton>
          )}
        </div>
        {images ? (
          <img src={images} alt="" />
        ) : (
          <div className={classes.skeleton} />
        )}
        <div className={classes["footer-calendar"]}>
          <div className={classes["calendar-day"]}>
            {format(new Date(event.startingDate), "dd")}
          </div>
          <div className={classes["calendar-month"]}>
            {format(new Date(event.startingDate), "MMM")}
          </div>
        </div>

        <header>
          <h4>{event.title}</h4>
        </header>

        <footer className={classes["footer"]}>
          <div className={classes["footer-left"]}>
            {/*<div>
              <i className="fa-solid fa-calendar-days"></i>
              <span>Datum</span>
            </div>
            <div>
              <div className={classes["footer-data"]}>
                {format(new Date(event.startingDate), "dd.MMM.yyyy")} -
                {format(new Date(event.endingDate), "dd.MMM.yyyy")}
              </div>
            </div>*/}
            {/*<div>
              <i className="fas fa-map-marked-alt"></i>
              <span>Lokacija</span>
            </div>*/}
            <div>
              <div className={classes["footer-data"]}>
                {event.location.name}
              </div>
            </div>
            <div>
              <div className={classes["footer-data"]}>
                {event.ticketPrice} rsd
              </div>
            </div>
          </div>

          <div className={classes["footer-right"]}>
            {
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
                  <FavoriteOutlinedIcon sx={{ fontSize: 40 }} />
                ) : (
                  <FavoriteBorderOutlinedIcon sx={{ fontSize: 40 }} />
                )}
                {showFavoritesInfo && (
                  <div className={classes.favoritesInfo}>
                    Dodaj u omiljeno!
                  </div>
                )}
              </div> /*<div>
              <i className="fa fa-ticket" aria-hidden="true"></i>
              <span>Ulaznica</span>
            </div>
            <div>
              <div className={classes["footer-data"]}>
                {event.ticketPrice} rsd
              </div>
            </div>*/
            }
            {/*<div>
              <i className="fa fa-users" aria-hidden="true"></i>
              <span>Kapacitet</span>
            </div>*/}
            {/*<div>
              <div className={classes["footer-data"]}>{event.capacity}</div>
            </div>*/}
          </div>
        </footer>
      </div>
    </>
  );
}

export default Event;
