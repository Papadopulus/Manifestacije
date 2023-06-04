import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/AuthContext";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "./MyEvents.module.css";
import Event from "../Events/Event";
import MyEventsList from "../Events/MyEvents/MyEventsList";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const shouldFetchEvents = useRef(true);

  const { user } = useContext(AuthContext);
  const getEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/events`,
        {
          params: {
            OrganizationId: user.OrganizationId,
            PageSize: 6,
            PageNumber: pageNumber,
            SortColumn: "Title",
          },
        }
      );
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
      getEvents();
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
          next={getEvents}
          hasMore={hasMore}
          dataLength={events.length}
          loader={
            <div className={classes.spinner}>
              <div className={classes.spinnerCircle}></div>
            </div>
          }
          endMessage={<h4 className={classes.noData}>No more data</h4>}
        >
          <div className={classes.Events}>
            {events.map((event) => (
              <React.Fragment key={event.id}>
                {isMobile ? (
                  <div className={classes.eventWrapper}>
                    <Event
                      key={event.id}
                      event={event}
                      setEvents={setEvents}
                      organization={true}
                    />
                  </div>
                ) : (
                  <MyEventsList
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
}

export default MyEvents;
