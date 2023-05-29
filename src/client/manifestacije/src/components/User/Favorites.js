import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import EventHorizontal from "../Events/EventHorizontal/EventHorizontal";
import Event from "../Events/Event";
import classes from "./Favorites.module.css"
import InfiniteScroll from "react-infinite-scroll-component";

const Favorites = () => {
    const [event, setEvent] = useState(null)
    const [events, setEvents] = useState([]);
    const shouldLog = useRef(true);

    const [pageSize, setPageSize] = useState(6);
    const [hasMore, setHasMore] = useState(true);


    const getAllEvents = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
                params: {
                    PageSize: pageSize
                }
            });
            if (response.data.length === 0) {
                console.log("popusis mi kurac nema vise")
                setHasMore(false); // Set hasMore to false if no more events are returned
            }
            console.log(response.data.length);
            setEvents(response.data);

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getAllEvents();
    }, [pageSize])


    return (
        // <div>
        // <div className={classes.allEvents}>
        //     {event &&<EventHorizontal event={event}/>}

            <InfiniteScroll next={() => setPageSize(pageSize + 6)}
                            hasMore={hasMore}
                            dataLength={events.length}
                            loader={<h4>Loading...</h4>}
                            endMessage={<h4>No more data</h4>}>

                <div className={classes.allEvents}>
                    {events.map((event) => (
                        <EventHorizontal key={event.id} event={event}/>
                    ))}
                </div>
            </InfiniteScroll>


    )
}
export default Favorites;