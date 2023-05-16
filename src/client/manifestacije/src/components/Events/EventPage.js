import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
function EventPage() {
  const { id } = useParams();
  const shouldLog = useRef(true);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/events/${id}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);
  return <div>EventPage for id : {id}</div>;
}

export default EventPage;
