import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import classes from "./EventPage.module.css";
import { Button } from "../Navbar/NavButton";
import { format } from "date-fns";
import MapMarker from "../../GoogleMaps/GPTMaps/MapMarker";
import Countdown from "./Countdown";
import Rating from "@mui/material/Rating";
import NotLoggedIn from "./NotLoggedIn";
import AuthContext from "../../store/AuthContext";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import { styled } from "@mui/material/styles";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PropTypes from "prop-types";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

function EventPage() {
  const { id } = useParams();
  const shouldLog = useRef(true);
  const shouldFav = useRef(true);
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState("");
  const [marker, setMarker] = useState({ lat: null, lng: null }); // initialized marker state
  const [ratingEvent, setRatingEvent] = useState(null);
  const [ratingOrg, setRatingOrg] = useState(null);
  const [comment, setComment] = useState("");
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoritesInfo, setShowFavoritesInfo] = useState(false);
  const [hasFavourites, setHasFavourites] = useState([]);
  const { user } = useContext(AuthContext);

  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));
  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      label: "Very Dissatisfied",
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" />,
      label: "Dissatisfied",
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" />,
      label: "Neutral",
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" />,
      label: "Satisfied",
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: "Very Satisfied",
    },
  };
  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }
  const loadFavourites = async () => {
    await checkTokenAndRefresh();
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    try {
      const hasFavouritesResponse = await axios.get(
        `https://localhost:7237/users/${user.Id}/favourites`,
        { headers: header }
      );
      setHasFavourites(hasFavouritesResponse.data);
      /*console.log(hasFavouritesResponse.data);*/
    } catch (error) {
      console.error("Error retrieving the user's favourite events:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/reviews`,
          {
            eventId: event.id,
            organizationRating: ratingOrg * 2,
            eventRating: ratingEvent * 2,
            comment: comment,
          },
          { headers: header }
        );
        console.log(response);
      } catch (error) {
        console.error("Error performing favorite action:", error);
      }
    }

    setRatingEvent(null);
    setRatingOrg(null);
    setComment("");
  };

  const loadImage = async (imageUrl) => {
    try {
      const imageResponse = await axios.get(
        `https://localhost:7085/Image/${imageUrl}`,
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
  useEffect(() => {
    if (shouldFav.current) {
      shouldFav.current = false;
      loadFavourites();
    }
    return () => {
      shouldFav.current = false;
    };
  }, []);

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
  }, [user, id, hasFavourites]);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/events/${id}`)
        .then((response) => {
          const { latitude, longitude } = response.data; // get latitude and longitude from response data
          setEvent(response.data);
          loadImage(response.data.imageUrls[0]);
          setMarker({ lat: latitude, lng: longitude }); // update marker state with latitude and longitude
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
    window.location.replace(`${event.ticketUrl}`);
  }

  function accHandler() {
    window.location.replace(`${event.accommodationPartner.url}`);
  }

  function transHandler() {
    window.location.replace(`${event.transportPartner.url}`);
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
            `https://localhost:7237/users/${user.Id}/events/${event.id}/favourites`,
            { headers: header }
          );
        } else {
          await axios.post(
            `https://localhost:7237/users/${user.Id}/events/${event.id}/favourites`,
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
  //console.log(event.startingDate);
  return (
    <>
      {notLoggedIn && <NotLoggedIn cancel={setNotLoggedIn}></NotLoggedIn>}
      <div className={classes.container}>
        <div className={classes.imageGrid}>
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
              <FavoriteOutlinedIcon sx={{ fontSize: 55 }} />
            ) : (
              <FavoriteBorderOutlinedIcon sx={{ fontSize: 55 }} />
            )}
            {showFavoritesInfo && (
              <div className={classes.favoritesInfo}>Dodaj u omiljeno!</div>
            )}
          </div>
          <img src={images} alt="" className={classes.image} />
        </div>

        <div className={classes["bottom-container"]}>
          <div className={classes["title-countdown"]}>
            <div className={classes["left-upper"]}>
              <div className={classes.header}>
                <h1 className={classes.title}>{event.title}</h1>
              </div>
              <div className={classes["date-location"]}>
                <div className={classes["dt"]}>
                  {format(new Date(event.startingDate), "dd·MMM·yyyy")} -&nbsp;
                  {format(new Date(event.endingDate), "dd·MMM·yyyy")}
                </div>
                <div>{event.location.name}</div>
              </div>
            </div>
            <div className={classes["countdown-right"]}>
              <Countdown targetDate={event.startingDate} />
            </div>
          </div>

          <div className={classes.description}>
            <h1 className={classes.descriptionTitle}>O manifestaciji</h1>
            <p>{event.description}</p>
          </div>
          <div className={classes.ticket}>
            <div className={classes.ticketLook}>
              <h1 className={classes.priceTitle}>
                Cena ulaznice&nbsp; · &nbsp;{event.ticketPrice}&nbsp;rsd
              </h1>

              {/*<p> Cena ulaznice:&nbsp;{event.ticketPrice} rsd</p>*/}
              <Button onClick={buyTicket} className={classes["ticketButton"]}>
                Kupi ulaznicu
              </Button>
            </div>
          </div>
          <div className={classes.details}>
            <h1 className={classes.descriptionTitle}>
              Detalji o manifestaciji
            </h1>
            <div className={classes.detailsWrapper}>
              <div className={classes.leftDetails}>
                <ul>
                  <li className={classes.date}>
                    <div className={classes.dateIcon}>
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <div className={classes.dateTitle}>
                      <p>DATUM</p>
                      {format(new Date(event.startingDate), "dd·MMM·yyyy")}{" "}
                      -&nbsp;
                      {format(new Date(event.endingDate), "dd·MMM·yyyy")}
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
                      {event.category.name}
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
                        {event.guests.map((guest, index) => (
                          <span key={guest}>
                            {guest}
                            {index !== event.guests.length - 1 && (
                              <span> ·&nbsp; </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className={classes.comp}>
                    <div className={classes.compIcon}>
                      <i className="fa-solid fa-ranking-star"></i>
                    </div>
                    <div className={classes.compTitle}>
                      <p>TAKMIČARI</p>
                      <div className={classes.compList}>
                        {event.competitors.map((competitor, index) => (
                          <span key={competitor}>
                            {competitor}
                            {index !== event.competitors.length - 1 && (
                              <span> ·&nbsp; </span>
                            )}
                          </span>
                        ))}
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

          <div className={classes.partners}>
            <h1 className={classes.descriptionTitle}>Parnteri</h1>
            <div className={classes.partnersWrapper}>
              <div className={classes.accPartnersLeft} onClick={accHandler}>
                <ul>
                  <li className={classes.accPartners}>
                    <div className={classes.accPartnersIcon}>
                      <i className="fa-solid fa-bed"></i>
                    </div>
                    <div className={classes.accPartnersTitle}>
                      <p>SMESTAJ</p>
                      {event.accommodationPartner.name}
                    </div>
                  </li>
                </ul>
              </div>
              <div className={classes.tranPartnersRight} onClick={transHandler}>
                <ul>
                  <li className={classes.tranPartners}>
                    <div className={classes.tranPartnersIcon}>
                      <i className="fa-solid fa-van-shuttle"></i>
                    </div>
                    <div className={classes.tranPartnersTitle}>
                      <p>TRANSPORT</p>
                      {event.transportPartner.name}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={classes.mapDisplay}>
            {marker.lat && marker.lng && <MapMarker markerLocation={marker} />}
          </div>
          <div className={classes.sponsor}>
            <h1 className={classes.descriptionTitle}>Sponzori</h1>
            <div className={classes.sponsorPresent}>
              <div className={classes.sponsorPresentIcon}>
                {/*<i className="fa-solid fa-hand-holding-dollar"></i>*/}
              </div>
              <div className={classes.sponsorPresentTitle}>
                {/*<p>Ova manifestacija je sponzorisana od strane: </p>*/}
                <div className={classes.sponsorList}>
                  {event.sponsors.map((sponsor, index) => (
                    <span key={sponsor}>
                      {sponsor}
                      {index !== event.sponsors.length - 1 && (
                        <span> ·&nbsp;</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.reviewSection}>
            <h1 className={classes.descriptionTitle}>Ostavi komentar</h1>
            <form onSubmit={handleSubmit}>
              <p>Oceni manifestaciju:</p>
              {/*<Rating
                name="simple-controlled"
                value={ratingEvent}
                size="large"
                precision={0.5}
                onChange={(event, newValue) => {
                  setRatingEvent(newValue);
                }}
              />*/}
              <StyledRating
                name="highlight-selected-only"
                value={ratingEvent}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => customIcons[value].label}
                highlightSelectedOnly
                onChange={(event, newValue) => {
                  setRatingEvent(newValue);
                }}
              />
              <p>Oceni organizatora:</p>
              <Rating
                name="simple-controlled"
                value={ratingOrg}
                size="large"
                precision={0.5}
                onChange={(event, newValue) => {
                  setRatingOrg(newValue);
                }}
              />

              <textarea
                placeholder="Unesite svoj komentar po zelji"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                onClick={handleSubmit}
                className={classes["ticketButton"]}
              >
                Pošalji
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventPage;
