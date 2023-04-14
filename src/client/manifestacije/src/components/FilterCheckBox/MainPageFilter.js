import React, { useEffect, useRef, useState } from "react";
import CheckBox from "./CheckBox";
import axios from "../../api/axios";

function MainPageFilter() {
  const [Filters, setFilters] = useState({ categories: [], locations: [] });
  const [categories, SetCategories] = useState([]);
  const [locations, SetLocations] = useState([]);
  const shouldLog = useRef(true);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/categories`)
        .then((response) => {
          SetCategories(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/locations`)
        .then((response) => {
          SetLocations(response.data);
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
  function handleFilters(filters, category) {
    const newFilters = { ...Filters };
    newFilters[category] = filters;
    //ovde se treba ubaci handle za filtere da se promene eventovi
    if (category === "locations") {
      console.log(filters);
    }
    setFilters(newFilters);
  }

  return (
    <>
      <CheckBox
        name={"Categories"}
        list={categories}
        handleFilters={(filters) => handleFilters(filters, "categories")}
      ></CheckBox>
      <CheckBox
        name={"Locations"}
        list={locations}
        handleFilters={(filters) => handleFilters(filters, "locations")}
      ></CheckBox>
    </>
  );
}

export default MainPageFilter;
