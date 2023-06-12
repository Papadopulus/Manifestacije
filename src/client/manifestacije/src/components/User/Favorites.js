import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
import Event from "../Events/Event";
import classes from "./Favorites.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import AuthContext from "../../store/AuthContext";
import checkTokenAndRefresh from "../../shared/tokenCheck";

const Favorites = () => {
  const [events, setEvents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const shouldFetchEvents = useRef(true);

  const { user } = useContext(AuthContext);
  const getAllFavorites = async () => {
    await checkTokenAndRefresh();
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    try {
      const response = await axios.get(
        `https://localhost:7237/users/${user.Id}/favourites`,
        {
          headers: header,
          params: {
            PageSize: 6,
            PageNumber: pageNumber,
            SortColumn: "Title",
          },
        }
      );
      // setEvents(response.data);
      /*console.log(hasFavouritesResponse.data);*/
      if (response.data.length === 0) {
        setHasMore(false);
      }
      setEvents((prev) => [...prev, ...response.data]);
      setPageNumber((prevState) => prevState + 1);
    } catch (error) {
      console.error("Error retrieving the user's favourite events:", error);
    }
  };

  useEffect(() => {
    if (shouldFetchEvents.current) {
      getAllFavorites();
      shouldFetchEvents.current = false;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styleS = {
    overflow: "unset",
  };

  return (
    <>
      {events.length > 0 ? (
        <InfiniteScroll
          style={styleS}
          next={getAllFavorites}
          hasMore={hasMore}
          dataLength={events.length}
          loader={
            <div className={classes.spinner}>
              <div className={classes.spinnerCircle}></div>
            </div>
          }
          endMessage={<h4 className={classes.noData}>No more data</h4>}
        >
          <div className={classes.allEvents}>
            {events.map((event) => (
              <React.Fragment key={event.id}>
                {isMobile ? (
                  <div className={classes.eventWrapper}>
                    <Event key={event.id} event={event} setEvents={setEvents} />
                  </div>
                ) : (
                  <EventHorizontal
                    key={event.id}
                    event={event}
                    user={user}
                    setEvents={setEvents}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className={classes.spinner}>
          <div className={classes.spinnerCircle}></div>
        </div>
      )}
    </>
  );
};

export default Favorites;
