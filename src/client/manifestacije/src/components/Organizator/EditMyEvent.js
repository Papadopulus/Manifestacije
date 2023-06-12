import React, { useEffect, useRef, useState } from "react";
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
import DialogBoxHandle from "./DialogBoxHandle";

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
  const [events, setEvents] = useState({ imageUrls: [] });
  
  const[ceoNizZaSlanje,setCeoNizZaSlanje] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);

  const [messageForBox,setMessageForBox] = useState(null);
  const [showDialog,setShowDialog] = useState(null);
  


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
    setCeoNizZaSlanje(responseEvent.data.imageUrls);
    loadImages(responseEvent.data.imageUrls);
    
  };
  // console.log("ovo su slike koje su stigle za ovaj event")
  // console.log(events.imageUrls);
  // console.log("ovo su slike koje se mapiraju ");
  // console.log(images);
  const loadImages = async (imageUrls) => {
    try {
        const images = await Promise.all(imageUrls.map(async (imageUrl) => {
          const imageResponse = await axios.get(
              `${process.env.REACT_APP_IMAGE_URL}/Image/${imageUrl}`,
              {responseType: "blob"}
          );
          const reader = new FileReader();
          reader.readAsDataURL(imageResponse.data);
          return new Promise((resolve, reject) => {
            reader.onloadend = function () {
              resolve(reader.result);
            };
            reader.onerror = reject;
          });
        }));
      setImages(images);
    } catch (error) {
      console.error("Error retrieving the images:", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setSelectedImageURL(imageUrl);
      // console.log(imageUrl);
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageURL) {
        URL.revokeObjectURL(selectedImageURL);
      }
    };
  }, [selectedImageURL]);
  // console.log(marker);
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
  const cancelDialogHandle = () => {
    setShowDialog(null);
  }

  const handleInputChange = (index, value) => {
    const updatedInputFields = [...sponsorInputFields];
    updatedInputFields[index] = value;
    setSponsorInputFields(updatedInputFields);
  };
  // console.log(images);
  const handleImageRemove = (urlToRemove, indexToRemove) => {
    setCeoNizZaSlanje(ceoNizZaSlanje.filter(url => url !== urlToRemove));
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };
  useEffect(() => {
    console.log(ceoNizZaSlanje);
    console.log(images);
  }, [ceoNizZaSlanje, images]);
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
    images.forEach((image, index) => {
      if (typeof image === "string") {
        // Old image, already on the server
        formData.append("imageRequest", events.imageUrls[index]);
      } else {
        // New image, needs to be uploaded
        formData.append("imageRequest", image);
      }
    });
    const imgResponse = await axios.post(
      `${process.env.REACT_APP_IMAGE_URL}/Image/onlyfiles`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
   
    // console.log("nakon post za only files da se gurnu na srv");
    // await setCeoNizZaSlanje(prevState => [...prevState,...imgResponse.data]);
    console.log("this is what will be sent ");
    console.log([...ceoNizZaSlanje,...imgResponse.data]);
    setCeoNizZaSlanje(prevState => [...prevState,...imgResponse.data]);
    
    
    // console.log(imgResponse.data.push(ceoNizZaSlanje));
    let payload = {
      title: title,
      description: description,
      startingDate: convertedDateStart,
      endingDate: convertedDateEnd,
      imageUrls: [...ceoNizZaSlanje,...imgResponse.data],
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
    console.log(payload);

    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    try {
      const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/events/${events.id}`,
          payload,
          { headers: header }
      );
      if (response.status === 200) { 
        setMessageForBox("Uspesno ste izmenili manifestaciju!");
      }
      console.log(response);
    }
    catch (e){
      setMessageForBox("Podaci koje ste uneli nisu validni!")
    }
    finally {
      setShowDialog(true);
    }
    

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
        {showDialog && (
            <DialogBoxHandle onCancel={cancelDialogHandle}>
              <p>{messageForBox}</p>
            </DialogBoxHandle>
        )}
        <form
          className={classesEvent["forma-event"]}
          onSubmit={formSubmissionHandler}
        >
          <div className={classesEvent["right-side-form"]}>
            <p className={"main-text"}>Izmeni manifestaciju!</p>
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
                {marker && <Map marker={marker} setMarker={setMarker}/>}
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
                      const files = Array.from(event.target.files);
                      if (files.length > 0) {
                        setImages(oldImages => [...oldImages, ...files]);
                      }
                    }}

                  />
                </label>
              </div>
              <div className={classesEvent["image-preview-container"]}>
                {images.map((image, index) => (
                  <div className={classesEvent["image-div"]} 
                       key={index}
                       // onClick={() => handleImageRemove(typeof image === "string" ? image : URL.createObjectURL(image), index)}
                  >
                    {/*{image instanceof Blob || image instanceof File ? (*/}
                    {/*  <img*/}
                    {/*    className={classesEvent["img"]}*/}
                    {/*    src={URL.createObjectURL(image)}*/}
                    {/*    alt={`Image ${index + 1}`}*/}
                    {/*  />*/}
                    {/*) : (*/}
                    {/*  <p>Slika je nevalidna!</p>*/}
                    {/*)}*/}
                    {typeof image === "string" ? (
                        <img
                            className={classesEvent["img"]}
                            src={image}
                            alt={`Image ${index + 1}`}
                        />
                    ) : (
                        <img
                            className={classesEvent["img"]}
                            src={URL.createObjectURL(image)}
                            alt={`Image ${index + 1}`}
                        />
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
