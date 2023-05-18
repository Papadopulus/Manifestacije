import React, { useEffect, useRef, useState } from "react";
import CheckBox from "./CheckBox";
import axios from "../../api/axios";
import PriceSlider from "./PriceSlider";
import classes from "./MainPageFilter.module.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range"; // theme css file
import "./MainPageFilter.css";
import { Collapse } from "antd";
import { Button } from "../Navbar/NavButton";
const { Panel } = Collapse;

function MainPageFilter(props) {
  const [Filters, setFilters] = useState({
    categories: [],
    locations: [],
    organizations: [],
  });
  const [categories, SetCategories] = useState([]);
  const [locations, SetLocations] = useState([]);
  const [organizations, SetOrganizations] = useState([]);
  const [selectedPrice, SetSelectedPrice] = useState([0, 10000]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date(2025, 1, 1));
  const [querySearch, SetQuerySearch] = useState("");
  const [resetFilters, SetResetFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const shouldLog = useRef(true);

  const handleSelect = (pickedDate) => {
    SetStartDate(pickedDate.selection.startDate);
    SetEndDate(pickedDate.selection.endDate);
    console.log(pickedDate.selection.startDate.toISOString());
    console.log(pickedDate.selection.endDate.toISOString());
  };
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/categories`)
        .then((response) => {
          SetCategories(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/locations`)
        .then((response) => {
          SetLocations(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/organizations`)
        .then((response) => {
          SetOrganizations(response.data);
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

    const minPrice = selectedPrice[0];
    const maxPrice = selectedPrice[1];

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/events`, {
        params: {
          CategoryId:
            newFilters["categories"].length < 1
              ? null
              : newFilters["categories"].toString(),
          LocationId:
            newFilters["locations"].length < 1
              ? null
              : newFilters["locations"].toString(),
          OrganizationId:
            newFilters["organizations"].length < 1
              ? null
              : newFilters["organizations"].toString(),
          MinTicketPrice: minPrice,
          MaxTicketPrice: maxPrice,
          MinStartingDate: startDate.toISOString(),
          MaxEndingDate: endDate.toISOString(),
          Title: querySearch.length < 1 ? null : querySearch,
          Description: querySearch.length < 1 ? null : querySearch,
          Street: querySearch.length < 1 ? null : querySearch,
          SortColumn: props.SortColumn,
          SortDirection: props.SortDirection,
          UnionColumns: "Title,Description,Street",
          IntersectionColumns:
            "MinEndingDate,CategoryId,LocationId,OrganizationId,MinTicketPrice,MaxTicketPrice,MinStartingDate,MaxEndingDate",
        },
      })
      .then((response) => {
        props.options(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setFilters(newFilters);
  }
  useEffect(() => {
    SetResetFilters(false);
    handleFilters();
  }, [
    selectedPrice,
    startDate,
    endDate,
    querySearch,
    props.SortColumn,
    props.SortDirection,
    resetFilters,
  ]);
  const changePrice = (event, value) => {
    SetSelectedPrice(value);
  };

  function setSearchQuery(value) {
    SetQuerySearch(value);
  }

  function resetFiltersHandler() {
    SetSelectedPrice([0, 10000]);
    SetStartDate(new Date());
    SetEndDate(new Date(2025, 1, 1));
    SetQuerySearch("");
    setFilters({ categories: [], locations: [], organizations: [] });
    SetResetFilters(true);
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className={classes["wrapper"]}>
        <i className={"fa fa-search"} aria-hidden="true"></i>
        <input
          className={classes["search-filter"]}
          placeholder={"Pretrazi manifestaciju"}
          type={"text"}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {isMobileView ? (
        <Collapse
          defaultActiveKey={["0"]}
          className={classes["home-filter-panel"]}
        >
          <Panel
            header={"Price Range"}
            key="1"
            className={classes["home-filter-panel-name"]}
          >
            <div className={classes["dropdown-options"]}>
              <CheckBox
                name={"Categories"}
                list={categories}
                handleFilters={(filters) =>
                  handleFilters(filters, "categories")
                }
                resetFilters={resetFilters}
              ></CheckBox>
              <CheckBox
                name={"Locations"}
                list={locations}
                handleFilters={(filters) => handleFilters(filters, "locations")}
                resetFilters={resetFilters}
              ></CheckBox>
              <CheckBox
                name={"Organizations"}
                list={organizations}
                handleFilters={(filters) =>
                  handleFilters(filters, "organizations")
                }
                resetFilters={resetFilters}
              ></CheckBox>

              <Collapse
                defaultActiveKey={["0"]}
                className={classes["home-filter-panel"]}
              >
                <Panel
                  header={"Price Range"}
                  key="1"
                  className={classes["home-filter-panel-name"]}
                >
                  <div className={classes["dropdown-options"]}>
                    <PriceSlider
                      value={selectedPrice}
                      changePrice={changePrice}
                    ></PriceSlider>
                  </div>
                </Panel>
              </Collapse>
              {/*<Collapse
                defaultActiveKey={["0"]}
                className={classes["home-filter-panel"]}
              >
                <Panel
                  header={"Date Range"}
                  key="1"
                  className={classes["home-filter-panel-name"]}
                >
                  <div className={classes["dropdown-options-date"]}>
                    <DateRange
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                      className={classes["date-picker"]}
                    />
                  </div>
                </Panel>
              </Collapse>*/}
              <div className={classes["button-wrapper"]}>
                <Button
                  onClick={resetFiltersHandler}
                  className={classes["home-filter-button"]}
                >
                  Clean Filters
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      ) : (
        <div className={classes["filters-wrapper"]}>
          <CheckBox
            name={"Categories"}
            list={categories}
            handleFilters={(filters) => handleFilters(filters, "categories")}
            resetFilters={resetFilters}
          ></CheckBox>
          <CheckBox
            name={"Locations"}
            list={locations}
            handleFilters={(filters) => handleFilters(filters, "locations")}
            resetFilters={resetFilters}
          ></CheckBox>
          <CheckBox
            name={"Organizations"}
            list={organizations}
            handleFilters={(filters) => handleFilters(filters, "organizations")}
            resetFilters={resetFilters}
          ></CheckBox>

          <Collapse
            defaultActiveKey={["0"]}
            className={classes["home-filter-panel"]}
          >
            <Panel
              header={"Price Range"}
              key="1"
              className={classes["home-filter-panel-name"]}
            >
              <div className={classes["dropdown-options"]}>
                <PriceSlider
                  value={selectedPrice}
                  changePrice={changePrice}
                ></PriceSlider>
              </div>
            </Panel>
          </Collapse>
          <Collapse
            defaultActiveKey={["0"]}
            className={classes["home-filter-panel"]}
          >
            <Panel
              header={"Date Range"}
              key="1"
              className={classes["home-filter-panel-name"]}
            >
              <div className={classes["dropdown-options-date"]}>
                <DateRange
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  className={classes["date-picker"]}
                />
              </div>
            </Panel>
          </Collapse>
          <div className={classes["button-wrapper"]}>
            <Button
              onClick={resetFiltersHandler}
              className={classes["home-filter-button"]}
            >
              Clean Filters
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default MainPageFilter;
