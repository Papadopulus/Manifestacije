﻿import React, { useEffect, useRef, useState } from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import useInput from "../../hooks/use-input";
import classesEvent from "./OrganisationEvent.module.css";
import Input from "../UI/Input/Input";
import classes2 from "../Register/RegisterInput.module.css";
import TextArea from "../UI/TextArea/TextArea";
import Map from "../../GoogleMaps/GPTMaps/GptMapsProba";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "../UI/Button/Button";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  uploadIcon: {
    width: "100%",
    height: "100%",
  },
});
function EditMyEvent() {
  const { id } = useParams();
  const [sponsorInputFields, setSponsorInputFields] = useState([""]);
  const [guestsInputFields, setGuestsInputFields] = useState([""]);
  const [competitorsFields, setCompetitorsFields] = useState([""]);
  const [marker, setMarker] = useState(null);
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);

  const shouldLog = useRef(true);
  const getEvent = async () => {
    const responseEvent = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/events/${id}`
    );
    setEvents(responseEvent.data);
    titleChangedHandler({ target: { value: responseEvent.data.title } });
    dateStartChangedHandler({
      target: {
        value: new Date(responseEvent.data.startingDate)
          .toISOString()
          .slice(0, 16),
      },
    });
    endingDateChangedHandler({
      target: {
        value: new Date(responseEvent.data.endingDate)
          .toISOString()
          .slice(0, 16),
      },
    });
    capacityChangedHandler({
      target: { value: responseEvent.data.capacity.toString() },
    });
    ticketPriceChangedHandler({
      target: { value: responseEvent.data.ticketPrice.toString() },
    });
    ticketUrlChangedHandler({
      target: { value: responseEvent.data.ticketUrl },
    });
    addressChangedHandler({
      target: { value: responseEvent.data.street },
    });
    descriptionChangedHandler({
      target: { value: responseEvent.data.description },
    });
    setGuestsInputFields(responseEvent.data.guests);
    setCompetitorsFields(responseEvent.data.competitors);
    setSponsorInputFields(responseEvent.data.sponsors);
    /*ovde da ubacimo da se setuju slike*/
    setMarker({
      lat: responseEvent.data.latitude,
      lng: responseEvent.data.longitude,
    });
  };
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getEvent();
    }
    return () => {
      shouldLog.current = false;
    };
  }, []);
  const {
    value: title,
    isValid: titleIsValid,
    hasError: titleInputHasError,
    valueChangedHandler: titleChangedHandler,
    inputBlurHandler: titleBlurHandler,
    resetFunction: resetTitleFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: dateStart,
    isValid: dateStartIsValid,
    hasError: dateStartInputHasError,
    valueChangedHandler: dateStartChangedHandler,
    inputBlurHandler: dateStartBlurHandler,
    resetFunction: resetDateStartFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: endingDate,
    isValid: endingDateIsValid,
    hasError: endingDateInputHasError,
    valueChangedHandler: endingDateChangedHandler,
    inputBlurHandler: endingDateBlurHandler,
    resetFunction: resetEndingDateFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: capacity,
    isValid: capacityIsValid,
    hasError: capacityInputHasError,
    valueChangedHandler: capacityChangedHandler,
    inputBlurHandler: capacityBlurHandler,
    resetFunction: resetCapacityFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: ticketPrice,
    isValid: ticketPriceIsValid,
    hasError: ticketPriceInputHasError,
    valueChangedHandler: ticketPriceChangedHandler,
    inputBlurHandler: ticketPriceBlurHandler,
    resetFunction: resetTicketPriceFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: ticketUrl,
    isValid: ticketUrlIsValid,
    hasError: ticketUrlInputHasError,
    valueChangedHandler: ticketUrlChangedHandler,
    inputBlurHandler: ticketUrlBlurHandler,
    resetFunction: resetTicketUrlFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: address,
    isValid: addressIsValid,
    hasError: addressInputHasError,
    valueChangedHandler: addressChangedHandler,
    inputBlurHandler: addressBlurHandler,
    resetFunction: resetAddressFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: description,
    isValid: descriptionIsValid,
    hasError: descriptionInputHasError,
    valueChangedHandler: descriptionChangedHandler,
    inputBlurHandler: descriptionBlurHandler,
    resetFunction: resetDescriptionFunction,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;
  if (
    titleIsValid &&
    dateStartIsValid &&
    endingDateIsValid &&
    capacityIsValid &&
    descriptionIsValid &&
    addressIsValid &&
    marker
  ) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }
  const handleAddCompetitorInput = () => {
    setCompetitorsFields([...competitorsFields, ""]);
  };
  const handleCompetitorInputChange = (index, value) => {
    const updatedInputFields = [...competitorsFields];
    updatedInputFields[index] = value;
    setCompetitorsFields(updatedInputFields);
  };

  const handleAddGuestInput = () => {
    setGuestsInputFields([...guestsInputFields, ""]);
  };

  const handleGuestInputChange = (index, value) => {
    const updatedInputFields = [...guestsInputFields];
    updatedInputFields[index] = value;
    setGuestsInputFields(updatedInputFields);
  };
  const handleAddSponsor = () => {
    setSponsorInputFields([...sponsorInputFields, ""]);
  };
  const resetMarkerFunction = () => {
    setMarker(null);
  };
  const resetImagesFunction = () => {
    setImages([]);
  };
  const resetGuestList = () => {
    setGuestsInputFields([""]);
  };
  const resetCompetitorList = () => {
    setCompetitorsFields([""]);
  };
  const resetSponsorList = () => {
    setSponsorInputFields([""]);
  };

  const handleInputChange = (index, value) => {
    const updatedInputFields = [...sponsorInputFields];
    updatedInputFields[index] = value;
    setSponsorInputFields(updatedInputFields);
  };
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    await checkTokenAndRefresh();

    if (
      !titleIsValid ||
      !dateStartIsValid ||
      !descriptionIsValid ||
      !endingDateIsValid ||
      !capacityIsValid ||
      !addressIsValid
    ) {
      return;
    }

    while (sponsorInputFields[sponsorInputFields.length - 1] === "") {
      sponsorInputFields.pop();
    }
    while (guestsInputFields[guestsInputFields.length - 1] === "") {
      guestsInputFields.pop();
    }
    while (competitorsFields[competitorsFields.length - 1] === "") {
      competitorsFields.pop();
    }

    let dateTimeMilliSeconds = new Date(dateStart);
    let convertedDateStart = dateTimeMilliSeconds.toISOString();
    let dateTimeMilliSecondsEnd = new Date(endingDate);
    let convertedDateEnd = dateTimeMilliSecondsEnd.toISOString();

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageRequest", image);
    });
    const imgResponse = await axios.post(
      "https://localhost:7085/Image/onlyfiles",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    let payload = {
      title: title,
      description: description,
      startingDate: convertedDateStart,
      endingDate: convertedDateEnd,
      imageUrls: imgResponse.data,
      guests: guestsInputFields,
      competitors: competitorsFields,
      capacity: capacity,
      ticketPrice: ticketPrice,
      ticketUrl: ticketUrl,
      sponsors: sponsorInputFields,
      street: address,
      latitude: marker.lat,
      longitude: marker.lng,
    };

    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/events/${events.id}`,
      payload,
      { headers: header }
    );
    console.log(response);

    /*resetTitleFunction();
    resetDateStartFunction();
    resetEndingDateFunction();
    resetGuestList();
    resetCompetitorList();

    resetCapacityFunction();
    resetTicketPriceFunction();
    resetSponsorList();
    resetTicketUrlFunction();
    resetAddressFunction();
    resetMarkerFunction();
    resetImagesFunction();*/
  };

  const classes = useStyles();

  return (
    <>
      <div className={classesEvent["div-container"]}>
        <form
          className={classesEvent["forma-event"]}
          onSubmit={formSubmissionHandler}
        >
          <div className={classesEvent["right-side-form"]}>
            <p className={"main-text"}>Dodaj manifestaciju!</p>
            <Input
              label={"Naslov"}
              type="text"
              id="titleEvent"
              value={title}
              onChange={titleChangedHandler}
              onBlur={titleBlurHandler}
              isNotValid={titleInputHasError}
              className={classes["input-form"]}
              isRequeired={true}
              firstLabelColor={"#333333"}
            ></Input>
            {titleInputHasError && (
              <label className={classes2["error-text"]}>Nevalidno ime!</label>
            )}
            <div className={classesEvent["desc-div"]}>
              <TextArea
                label={"Opis"}
                id="description"
                value={description}
                onChange={descriptionChangedHandler}
                onBlur={descriptionBlurHandler}
                isNotValid={descriptionInputHasError}
                className={classes["input-form"]}
                isRequeired={true}
                firstLabelColor={"#333333"}
              />
              {descriptionInputHasError && (
                <label className={classes2["error-text"]}>
                  Nevalidan opis manifestacije!
                </label>
              )}
            </div>

            <div className={classesEvent["two-in-row"]}>
              <div className={classesEvent["column-in-row"]}>
                <Input
                  label={"Datum početka"}
                  type="datetime-local"
                  id="dateStart"
                  value={dateStart}
                  onChange={dateStartChangedHandler}
                  onBlur={dateStartBlurHandler}
                  isNotValid={dateStartInputHasError}
                  className={classesEvent["input-form"]}
                  isRequeired={true}
                  firstLabelColor={"#333333"}
                ></Input>
                {dateStartInputHasError && (
                  <label className={classes2["error-text"]}>
                    Nevalidan datum početka manifestacije!
                  </label>
                )}
              </div>

              <div className={classesEvent["column-in-row"]}>
                <Input
                  label={"Datum završetka"}
                  type="datetime-local"
                  id="endingDate"
                  value={endingDate}
                  onChange={endingDateChangedHandler}
                  onBlur={endingDateBlurHandler}
                  isNotValid={endingDateInputHasError}
                  className={classesEvent["input-form"]}
                  isRequeired={true}
                  firstLabelColor={"#333333"}
                ></Input>
                {endingDateInputHasError && (
                  <label className={classes2["error-text"]}>
                    Nevalidan datum završetka manifestacije!
                  </label>
                )}
              </div>
            </div>

            <div className={classesEvent["adding-inputs"]}>
              {guestsInputFields.map((input, index) => (
                <Input
                  key={index}
                  label={`Gost ${index + 1}`}
                  type="text"
                  value={input}
                  onChange={(event) =>
                    handleGuestInputChange(index, event.target.value)
                  }
                  firstLabelColor={"#333333"}
                  // className={classes["input-form"]}
                />
              ))}

              <div className={`${classesEvent["button-add"]}`}>
                <button
                  type={"button"}
                  onClick={handleAddGuestInput}
                  className={`${classesEvent["plus-button"]} ${classesEvent["button-with-image"]}`}
                >
                  +
                </button>
              </div>
            </div>

            <div className={classesEvent["adding-inputs"]}>
              {competitorsFields.map((input, index) => (
                <Input
                  key={index}
                  label={`Takmičar ${index + 1}`}
                  type="text"
                  value={input}
                  onChange={(event) =>
                    handleCompetitorInputChange(index, event.target.value)
                  }
                  className={classes["input-form"]}
                  firstLabelColor={"#333333"}
                />
              ))}
              <div className={`${classesEvent["button-add"]}`}>
                <button
                  type={"button"}
                  onClick={handleAddCompetitorInput}
                  className={`${classesEvent["plus-button"]} ${classesEvent["button-with-image"]}`}
                >
                  +
                </button>
              </div>
            </div>
            <Input
              label="Kapacitet"
              type="number"
              id="capacity"
              value={capacity}
              onChange={capacityChangedHandler}
              onBlur={capacityBlurHandler}
              isNotValid={capacityInputHasError}
              className={classes["input-form"]}
              isRequeired={true}
              firstLabelColor={"#333333"}
            ></Input>
            {capacityInputHasError && (
              <label className={classes2["error-text"]}>
                Invalid capacity!
              </label>
            )}
            <div className={classesEvent["two-in-row"]}>
              <div className={classesEvent["column-in-row"]}>
                <Input
                  label="Cena ulaznice"
                  type="number"
                  id="ticketPrice"
                  value={ticketPrice}
                  onChange={ticketPriceChangedHandler}
                  firstLabelColor={"#333333"}
                  // className={classes["input-form"]}
                ></Input>
              </div>
              <div className={classesEvent["column-in-row"]}>
                <Input
                  label="URL Karte"
                  type="text"
                  id="ticketUrl"
                  value={ticketUrl}
                  onChange={ticketUrlChangedHandler}
                  firstLabelColor={"#333333"}
                  // className={classes["input-form"]}
                ></Input>
              </div>
            </div>

            <div className={classesEvent["adding-inputs"]}>
              {sponsorInputFields.map((input, index) => (
                <Input
                  key={index}
                  label={`Sponzor ${index + 1}`}
                  type="text"
                  value={input}
                  onChange={(event) =>
                    handleInputChange(index, event.target.value)
                  }
                  className={classes["input-form"]}
                  firstLabelColor={"#333333"}
                />
              ))}

              <div className={`${classesEvent["button-add"]}`}>
                <button
                  type={"button"}
                  onClick={handleAddSponsor}
                  className={`${classesEvent["plus-button"]} ${classesEvent["button-with-image"]}`}
                >
                  +
                </button>
              </div>
            </div>

            <div className={classesEvent["adr-and-map"]}>
              <div className={classesEvent["input-address"]}>
                <Input
                  label="Adresa manifestacije"
                  type="text"
                  id="address"
                  value={address}
                  onChange={addressChangedHandler}
                  onBlur={addressBlurHandler}
                  isNotValid={addressInputHasError}
                  className={`${classes["input-form"]}`}
                  isRequeired={true}
                  firstLabelColor={"#333333"}
                ></Input>
                {addressInputHasError && (
                  <label className={classes2["error-text"]}>
                    Invalid address!
                  </label>
                )}
              </div>

              <div className={classesEvent["map-form"]}>
                <p>Označite manifestaciju na mapi!</p>
                <Map setMarker={setMarker} />
              </div>
            </div>
            <p className={classesEvent["upload-pictures"]}>Dodaj fotografiju</p>
            <div className={classesEvent["upload-div"]}>
              <div className={`${classesEvent["choose-file"]}`}>
                <label className={classesEvent["choose-file-label"]}>
                  {/*<img src={CloudUploadIcon} alt="Upload Icon" className={classesEvent["upload-icon"]} />*/}
                  <CloudUploadIcon className={classes.uploadIcon} />
                  <input
                    type={"file"}
                    multiple
                    onChange={async (event) => {
                      // const files = Array.from(event.target.files);
                      // setImages(files);
                      const files = Array.from(event.target.files); // Convert the FileList to an array

                      // Validate if files are selected
                      if (files.length > 0) {
                        setImages(files);
                      }
                    }}
                  />
                </label>
              </div>
              <div className={classesEvent["image-preview-container"]}>
                {images.map((image, index) => (
                  <div className={classesEvent["image-div"]} key={index}>
                    {image instanceof Blob || image instanceof File ? (
                      <img
                        className={classesEvent["img"]}
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index + 1}`}
                      />
                    ) : (
                      <p>Slika je nevalidna!</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type={"submit"}
              className={classes["login-button"]}
              disabled={!formIsValid}
            >
              Izmeni manifestaciju
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditMyEvent;