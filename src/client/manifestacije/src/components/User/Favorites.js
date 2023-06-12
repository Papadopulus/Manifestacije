// import React, {useEffect, useRef, useState} from "react";
// import axios from "axios";
// import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
//
// import classes from "./Favorites.module.css"
// import InfiniteScroll from "react-infinite-scroll-component";
//
// const Favorites = () => {
//     const [events, setEvents] = useState([]);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//
//     const shouldLog = useRef(true);
//     const getAllEvents =  async () => {
//
//          await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
//             params: {
//                 PageSize: 6,
//                 PageNumber: pageNumber,
//                 SortColumn: "Title"
//             }
//         })
//             .then(response => {
//                 if(response.data.length === 0)
//                 {
//                     setHasMore( false);
//                 }
//                 setEvents(prev => [...prev, ...response.data]);
//                 setPageNumber(prevState => prevState + 1);
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//
//     };
//     useEffect(() => {
//         if (shouldLog.current) {
//             getAllEvents();
//             shouldLog.current = false;
//         }
//         return () => {
//             shouldLog.current = false;
//         }
//     }, []);
//
//     return (
//         <InfiniteScroll next={getAllEvents}
//                         hasMore={hasMore}
//                         dataLength={events.length}
//                         loader={<h4>Loading...</h4>}
//                         endMessage={<h4>No more data</h4>}>
//
//             <div className={classes.allEvents}>
//                 {events.map((event) => (
//                     <EventHorizontal key={event.id} event={event}/>
//                 ))}
//             </div>
//         </InfiniteScroll>
//     );
// };
//
// export default Favorites;

// import React, {useEffect, useRef, useState} from "react";
// import axios from "axios";
// import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
// import classes from "./Favorites.module.css";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Event from "../Events/Event";
//
// const Favorites = () => {
//     const [events, setEvents] = useState([]);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const shouldFetchEvents = useRef(true);
//
//     const getAllEvents = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
//                 params: {
//                     PageSize: 6,
//                     PageNumber: pageNumber,
//                     SortColumn: "Title",
//                 },
//             });
//
//             if (response.data.length === 0) {
//                 setHasMore(false);
//             }
//
//             setEvents((prev) => [...prev, ...response.data]);
//             setPageNumber((prevState) => prevState + 1);
//         } catch (error) {
//             console.log(error);
//         }
//     };
//
//     useEffect(() => {
//         if (shouldFetchEvents.current) {
//             getAllEvents();
//             shouldFetchEvents.current = false;
//         }
//     }, []);
//     const styleS = {
//         overflow:"unset",
//     }
//     return (
//         <>
//             {/*{events.map((event) => (*/}
//             {/*    <Event key={event.id} event={event}/>*/}
//             {/*))}*/}
//             {events.length > 0 ? (
//                 <InfiniteScroll
//                     style={styleS}
//                     next={getAllEvents}
//                     hasMore={hasMore}
//                     dataLength={events.length}
//                     loader=
//                         {
//                         <div className={classes.spinner}>
//                             <div className={classes.spinnerCircle}></div>
//                         </div>
//                 }
//                     endMessage={<h4 className={classes.noData}>No more data</h4>}
//                 >
//                     <div className={classes.allEvents}>
//                         {events.map((event) => (
//                             <EventHorizontal key={event.id} event={event}/>
//                         ))}
//                     </div>
//                 </InfiniteScroll>
//             ) : (
//                 <div className={classes.spinner}>
//                     <div className={classes.spinnerCircle}></div>
//                 </div>
//             )
//             }
//         </>
//     );
// };
//
// export default Favorites;

import React, { useContext, useEffect, useRef, useState } from "react";
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
  // const getAllEvents = async () => {
  //     try {
  //         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
  //             params: {
  //                 PageSize: 6,
  //                 PageNumber: pageNumber,
  //                 SortColumn: "Title",
  //             },
  //         });
  //
  //         if (response.data.length === 0) {
  //             setHasMore(false);
  //         }
  //
  //         setEvents((prev) => [...prev, ...response.data]);
  //         setPageNumber((prevState) => prevState + 1);
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };

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
