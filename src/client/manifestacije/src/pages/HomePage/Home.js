import MainPageFilter from "../../components/FilterCheckBox/MainPageFilter";
import classes from "./Home.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import EventList from "../../components/Events/EventList";

const Home = () => {
  const [events, SetEvents] = useState([]);
  const [selectedPriceOrder, SetSelectedPriceOrder] = useState("popular");
  const [columnName, SetColumnName] = useState("Views");
  const [directionSort, SetDirectionSort] = useState("desc");

  const shouldLog = useRef(true);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/events`)
        .then((response) => {
          SetEvents(response.data);
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

  const sorting = (e) => {
    if (e === "popularLowest") {
      SetColumnName("Views");
      SetDirectionSort("asc");
    } else if (e === "popularHighest") {
      SetColumnName("Views");
      SetDirectionSort("desc");
    } else if (e === "dateLowest") {
      SetColumnName("StartingDate");
      SetDirectionSort("asc");
    } else if (e === "dateHighest") {
      SetColumnName("StartingDate");
      SetDirectionSort("desc");
    } else if (e === "priceLowest") {
      SetColumnName("TicketPrice");
      SetDirectionSort("asc");
    } else if (e === "priceHighest") {
      SetColumnName("TicketPrice");
      SetDirectionSort("desc");
    }
    SetSelectedPriceOrder(e);
  };
  return (
    <div className={classes["home-container"]}>
      <div className={classes["left-containter-home"]}>
        <MainPageFilter
          options={SetEvents}
          SortColumn={columnName}
          SortDirection={directionSort}
        ></MainPageFilter>
      </div>
      <div className={classes["right-containter-home"]}>
        <div>
          <div className={classes["sort-selection"]}>
            <h5 className={classes["sort-title"]}>Sortiraj prema:</h5>
            <select
              value={selectedPriceOrder}
              onChange={(e) => sorting(e.target.value)}
            >
              <option value={"popularLowest"}>Popularnosti rastuce</option>
              <option value={"popularHighest"}>Popularnosti opadajuce</option>
              <option value={"dateLowest"}>Datumu najblizem</option>
              <option value={"dateHighest"}>Datumu najdaljem</option>
              <option value="priceLowest">Ceni rastuce</option>
              <option value="priceHighest">Ceni opadajuce</option>
            </select>
          </div>
        </div>
        <div className={classes["main-events"]}>
          <EventList events={events}></EventList>
          {/*{events.map((event) => (
            <div key={event.id}>
              <p>{event.title}</p>
            </div>
          ))}*/}
        </div>
      </div>
    </div>
  );
};
export default Home;
