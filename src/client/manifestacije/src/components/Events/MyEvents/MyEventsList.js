import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import classes from "./MyEventsList.module.css";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

function MyEventsList({ event }) {
  const [images, setImages] = useState(null);
  const navigate = useNavigate();
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
  function onClickEventHandler() {
    navigate("/events/" + event.id);
  }
  const handleEdit = () => {
    navigate("/editEvents/" + event.id);
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
    <div className={classes.mainContainer} onClick={onClickEventHandler}>
      <div
        className={classes.favoriteIcon}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          <EditIcon sx={{ fontSize: 30 }}></EditIcon>
        </IconButton>
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
}

export default MyEventsList;
