﻿import MainPageFilter from "../../components/FilterCheckBox/MainPageFilter";
import classes from "./Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import EventList from "../../components/Events/EventList";
import Event from "../../components/Events/Event";

const Home = () => {
  const [events, SetEvents] = useState([]);
  const [selectedPriceOrder, SetSelectedPriceOrder] = useState("popular");
  const [columnName, SetColumnName] = useState("Views");
  const [directionSort, SetDirectionSort] = useState("desc");

  // const [pageNumber,setPageNumber] = useState(1);
  // // const [itemsPerPage,setItemsPerPage] = useState(5);
  // const shouldLog = useRef(true);
  
  // const getEventsAsync = async () => {
  //   const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`,{
  //     params:{
  //       PageSize:itemsPerPage,
  //       PageNumber:pageNumber
  //     }
  //   });
  //   SetEvents(pre => [...pre,...response.data]);
  // }
  // // useEffect(() => {
  // //   if (shouldLog.current) {
  // //     shouldLog.current = false;
  // //     // axios
  // //     //   .get(`${process.env.REACT_APP_BASE_URL}/events`,{
  // //     //     params:{
  // //     //       PageSize:itemsPerPage,
  // //     //       PageNumber:pageNumber
  // //     //     }
  // //     //   })
  // //     //   .then((response) => {
  // //     //     // SetEvents(response.data);
  // //     //     SetEvents(pre => [...pre,...response.data]);
  // //     //     console.log(response.data);
  // //     //    
  // //     //   })
  // //     //   .catch((err) => {
  // //     //     console.log(err);
  // //     //   });
  // //     getEventsAsync();
  // //   }
  // //   return () => {
  // //     shouldLog.current = false;
  // //   };
  // // }, [pageNumber]);
  //
  // useEffect( () => {
  //   const handleScroll = (event) => {
  //     const scrollHeight = event.target.documentElement.scrollHeight
  //     const currentHeight = event.target.documentElement.scrollTop + window.innerHeight
  //     if (currentHeight + 1 >= scrollHeight){
  //       setPageNumber(pageNumber + 1);
  //       getEventsAsync();
  //     }
  //   }
  //   window.addEventListener("scroll",handleScroll)
  //   return () => window.removeEventListener("scroll",handleScroll)
  // },[pageNumber])
  // console.log(itemsPerPage + " items per page");
  // console.log(pageNumber + " page number")

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
      <div className={classes["left-container-home"]}>
        <MainPageFilter
          options={SetEvents}
          SortColumn={columnName}
          SortDirection={directionSort}
        ></MainPageFilter>
      </div>
      <div className={classes["right-container-home"]}>
        <div className={classes["sort-selection"]}>
          <div className={classes["sort-wrapper"]}>
            <h5 className={classes["sort-title"]}>Sortiraj:</h5>
            <select
              value={selectedPriceOrder}
              onChange={(e) => sorting(e.target.value)}
            >
              <option value={"popularLowest"}>Popularnost rastuća</option>
              <option value={"popularHighest"}>Popularnost opadajuć</option>
              <option value={"dateLowest"}>Datum najbliži</option>
              <option value={"dateHighest"}>Datum najdalji</option>
              <option value="priceLowest">Cena rastuća</option>
              <option value="priceHighest">Cena opadajuća</option>
            </select>
          </div>
        </div>

        <div className={classes["main-events"]}>
          <EventList events={events}></EventList>
        </div>
      </div>
    </div>
  );
};
export default Home;
