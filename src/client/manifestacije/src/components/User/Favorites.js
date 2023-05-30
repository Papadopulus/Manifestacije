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
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
import classes from "./Favorites.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

const Favorites = () => {
    const [events, setEvents] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const shouldFetchEvents = useRef(true);

    const getAllEvents = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
                params: {
                    PageSize: 6,
                    PageNumber: pageNumber,
                    SortColumn: "Title",
                },
            });

            if (response.data.length === 0) {
                setHasMore(false);
            }

            setEvents((prev) => [...prev, ...response.data]);
            setPageNumber((prevState) => prevState + 1);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (shouldFetchEvents.current) {
            getAllEvents();
            shouldFetchEvents.current = false;
        }
    }, []);

    return (
        <>
            {events.length > 0 && (
                <InfiniteScroll
                    next={getAllEvents}
                    hasMore={hasMore}
                    dataLength={events.length}
                    loader={<h4>Loading...</h4>}
                    endMessage={<h4>No more data</h4>}
                >
                    <div className={classes.allEvents}>
                        {events.map((event) => (
                            <EventHorizontal key={event.id} event={event} />
                        ))}
                    </div>
                </InfiniteScroll>
            )
            }
        </>
    );
};

export default Favorites;
