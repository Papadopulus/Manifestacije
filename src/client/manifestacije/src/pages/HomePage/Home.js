import classes from "./Home.module.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import EventList from "../../components/Events/EventList";
import InfiniteScroll from "react-infinite-scroll-component";

import CheckBox from "../../components/FilterCheckBox/CheckBox";
import PriceSlider from "../../components/FilterCheckBox/PriceSlider";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range"; // theme css file
import "../../components/FilterCheckBox/MainPageFilter.css";
import { Collapse } from "antd";
import { Button } from "../../components/Navbar/NavButton";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import AuthContext from "../../store/AuthContext";
import BackToTopButton from "../../components/UI/BackToTopButton/BackToTopButton";
const { Panel } = Collapse;

const Home = () => {
  const [events, SetEvents] = useState([]);
  const [selectedPriceOrder, SetSelectedPriceOrder] = useState("popular");
  const [columnName, SetColumnName] = useState("Title");
  const [directionSort, SetDirectionSort] = useState("desc");
  const [currentPrice, setCurrentPrice] = useState([0, 9999]);

  const { user } = useContext(AuthContext);
  const [Filters, setFilters] = useState({
    categories: [],
    locations: [],
    organizations: [],
  });
  const [categories, SetCategories] = useState([]);
  const [locations, SetLocations] = useState([]);
  const [organizations, SetOrganizations] = useState([]);
  const [selectedPrice, SetSelectedPrice] = useState([0, 10000]);
  const [startDate, SetStartDate] = useState(new Date(2023, 1, 1));
  const [endDate, SetEndDate] = useState(new Date(2025, 1, 1));
  const [querySearch, SetQuerySearch] = useState("");
  const [resetFilters, SetResetFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hasMore, SetHasMore] = useState(true);

  const shouldLog = useRef(true); //za category org i loc
  const shouldFetch = useRef(true); //za handleFilters
  const handleFiltersTimeout = useRef(null); //za priceSlider

  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, SetItemsPerPage] = useState(9);
  

  const handleSelect = (pickedDate) => {
    shouldFetch.current = true;
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
  const getFilters = async () => {
    try {
      const responseCategory = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/categories`
      );
      SetCategories(responseCategory.data);
      const responseLocations = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/locations`
      );
      SetLocations(responseLocations.data);
      const responseOrganizations = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/organizations`
      );
      SetOrganizations(responseOrganizations.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getFilters();
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);

  async function handleFilters(filters, category, numberPage) {
    const newFilters = { ...Filters };
    newFilters[category] = filters;

    const minPrice = selectedPrice[0];
    const maxPrice = selectedPrice[1];
    if (user) {
      await checkTokenAndRefresh();
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/events`,
        {
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

            PageSize: itemsPerPage,
            PageNumber: numberPage,

            Title: querySearch.length < 1 ? null : querySearch,
            Description: querySearch.length < 1 ? null : querySearch,
            Street: querySearch.length < 1 ? null : querySearch,
            SortColumn: columnName,
            SortDirection: directionSort,
            UnionColumns: "Title,Description,Street",
            IntersectionColumns:
              "MinEndingDate,CategoryId,LocationId,OrganizationId,MinTicketPrice,MaxTicketPrice,MinStartingDate,MaxEndingDate",
          },
        }
      );
      if (response.data.length === 0) {
        SetHasMore(false);
      }

      setPageNumber((prevState) => prevState + 1);
      SetEvents((prev) => [...prev, ...response.data]);

      //SetEvents(response.data);
    } catch (err) {
      console.log(err);
    }
    setFilters(newFilters);
  }

  useEffect(() => {
    SetResetFilters(false);

    if (shouldFetch.current) {
      //stavi PageNumber=1
      SetHasMore(true);
      SetEvents([]);
      setPageNumber(1);
      handleFilters(null, null, 1);
      shouldFetch.current = false;
    }
  }, [
    selectedPrice,
    startDate,
    endDate,
    querySearch,
    columnName,
    directionSort,
    resetFilters,
  ]);

  const changePrice = (event, value) => {
    shouldFetch.current = true;
    setCurrentPrice(value);
    clearTimeout(handleFiltersTimeout.current);
    handleFiltersTimeout.current = setTimeout(() => {
      SetSelectedPrice(value);
    }, 600);
  };

  function setSearchQuery(value) {
    shouldFetch.current = true;
    SetQuerySearch(value);
  }

  function resetFiltersHandler() {
    shouldFetch.current = true;
    SetSelectedPrice([0, 10000]);
    SetStartDate(new Date(2023, 1, 1));
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
  const styleS = {
    overflow: "unset",
  };
  return (
    <div className={classes["home-container"]}>
      <BackToTopButton/>
      <div className={classes["left-container-home"]}>
        <div className={classes["wrapper"]}>
          <i className={"fa fa-search"} aria-hidden="true"></i>
          <input
            className={classes["search-filter"]}
            placeholder={" Pretraga"}
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
              header={"Filteri"}
              key="1"
              className={classes["home-filter-panel-name"]}
            >
              <div className={classes["dropdown-options"]}>
                <CheckBox
                  name={"Kategorije"}
                  list={categories}
                  handleFilters={(filters) => {
                    SetHasMore(true);
                    SetEvents([]);
                    setPageNumber(1);
                    handleFilters(filters, "categories", 1);
                  }}
                  resetFilters={resetFilters}
                ></CheckBox>
                <CheckBox
                  name={"Loakcije"}
                  list={locations}
                  handleFilters={(filters) => {
                    SetHasMore(true);
                    SetEvents([]);
                    setPageNumber(1);
                    handleFilters(filters, "locations", 1);
                  }}
                  resetFilters={resetFilters}
                ></CheckBox>
                <CheckBox
                  name={"Organizacije"}
                  list={organizations}
                  handleFilters={async (filters) => {
                    SetHasMore(true);
                    SetEvents([]);
                    setPageNumber(1);
                    handleFilters(filters, "organizations", 1);
                  }}
                  resetFilters={resetFilters}
                ></CheckBox>

                <Collapse
                  defaultActiveKey={["0"]}
                  className={classes["home-filter-panel"]}
                >
                  <Panel
                    header={"Cena ulaznice"}
                    key="1"
                    className={classes["home-filter-panel-name"]}
                  >
                    <div className={classes["dropdown-options"]}>
                      <PriceSlider
                        value={currentPrice}
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
                    Obriši filtere
                  </Button>
                </div>
              </div>
            </Panel>
          </Collapse>
        ) : (
          <div className={classes["filters-wrapper"]}>
            <CheckBox
              name={"Kategorije"}
              list={categories}
              handleFilters={(filters) => {
                SetHasMore(true);
                SetEvents([]);
                setPageNumber(1);
                handleFilters(filters, "categories", 1);
              }}
              resetFilters={resetFilters}
            ></CheckBox>
            <CheckBox
              name={"Lokacije"}
              list={locations}
              handleFilters={(filters) => {
                SetHasMore(true);
                SetEvents([]);
                setPageNumber(1);
                handleFilters(filters, "locations", 1);
              }}
              resetFilters={resetFilters}
            ></CheckBox>
            <CheckBox
              name={"Organizacije"}
              list={organizations}
              handleFilters={(filters) => {
                SetHasMore(true);
                SetEvents([]);
                setPageNumber(1);
                handleFilters(filters, "organizations", 1);
              }}
              resetFilters={resetFilters}
            ></CheckBox>

            <Collapse
              defaultActiveKey={["0"]}
              className={classes["home-filter-panel"]}
            >
              <Panel
                header={"Cena ulaznice"}
                key="1"
                className={classes["home-filter-panel-name"]}
              >
                <div className={classes["dropdown-options-price"]}>
                  <div className={classes["input-options"]}>
                    <label
                      className={classes["price-label"]}
                      htmlFor="price-from"
                    >
                      Cena od:
                    </label>
                    <input
                      type="number"
                      value={currentPrice[0]}
                      onChange={(e) => {
                        shouldFetch.current = true;
                        setCurrentPrice([e.target.value, currentPrice[1]]);
                        SetSelectedPrice([e.target.value, currentPrice[1]]);
                      }}
                      className={classes["price-input"]}
                    />
                    <label
                      className={classes["price-label"]}
                      htmlFor="price-to"
                    >
                      Cena do:
                    </label>
                    <input
                      type="number"
                      value={currentPrice[1]}
                      onChange={(e) => {
                        shouldFetch.current = true;
                        setCurrentPrice([currentPrice[0], e.target.value]);
                        SetSelectedPrice([currentPrice[0], e.target.value]);
                      }}
                      className={classes["price-input"]}
                    />
                  </div>
                  <PriceSlider
                    value={currentPrice}
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
                header={"Datum"}
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
                Obriši filtere
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className={classes["right-container-home"]}>
        <div className={classes["sort-selection"]}>
          <div className={classes["sort-wrapper"]}>
            <h5 className={classes["sort-title"]}>Sortiraj:</h5>
            <select
              value={selectedPriceOrder}
              onChange={(e) => {
                shouldFetch.current = true;
                sorting(e.target.value);
              }}
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
        {events.length > 0 && (
          <InfiniteScroll 
              style={styleS}
            next={() => handleFilters(null, null, pageNumber)}
            hasMore={hasMore}
            dataLength={events.length}
            loader={<h4>Loading...</h4>}
          >
            <div className={classes["main-events"]}>
              <EventList events={events}></EventList>
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
export default Home;
