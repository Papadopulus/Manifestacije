import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import classes from "../Login/LoginInput.module.css";
import classes2 from "../Register/RegisterInput.module.css"
import Button from "../UI/Button/Button";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import {useEffect, useRef, useState} from "react";
import Map from "../../GoogleMaps/GPTMaps/GptMapsProba"
import OrganisationEvent from "./OrganisationEvent.css"

const AddEventForm = () => {

    const [sponsorInputFields, setSponsorInputFields] = useState([''])
    const [guestsInputFields, setGuestsInputFields] = useState(['']);
    const [competitorsFields, setCompetitorsFields] = useState(['']);
    const [allLocations, setAllLocations] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [marker, setMarker] = useState(null);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState(null);

    const shouldLog = useRef(true);

    const getLocationsAndCategories = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const responseLocations = await axios.get(`${process.env.REACT_APP_BASE_URL}/locations`, {headers: header})
        const responseCategories = await axios.get(`${process.env.REACT_APP_BASE_URL}/categories`, {headers: header})

        setAllLocations(responseLocations.data);
        setAllCategories(responseCategories.data);

    }

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            getLocationsAndCategories();
        }
        return () => {
            shouldLog.current = false;
        }

    }, [])
    const {
        value: title,
        isValid: titleIsValid,
        hasError: titleInputHasError,
        valueChangedHandler: titleChangedHandler,
        inputBlurHandler: titleBlurHandler,
        resetFunction: resetTitleFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: dateStart,
        isValid: dateStartIsValid,
        hasError: dateStartInputHasError,
        valueChangedHandler: dateStartChangedHandler,
        inputBlurHandler: dateStartBlurHandler,
        resetFunction: resetDateStartFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: endingDate,
        isValid: endingDateIsValid,
        hasError: endingDateInputHasError,
        valueChangedHandler: endingDateChangedHandler,
        inputBlurHandler: endingDateBlurHandler,
        resetFunction: resetEndingDateFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: capacity,
        isValid: capacityIsValid,
        hasError: capacityInputHasError,
        valueChangedHandler: capacityChangedHandler,
        inputBlurHandler: capacityBlurHandler,
        resetFunction: resetCapacityFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: ticketPrice,
        isValid: ticketPriceIsValid,
        hasError: ticketPriceInputHasError,
        valueChangedHandler: ticketPriceChangedHandler,
        inputBlurHandler: ticketPriceBlurHandler,
        resetFunction: resetTicketPriceFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: ticketUrl,
        isValid: ticketUrlIsValid,
        hasError: ticketUrlInputHasError,
        valueChangedHandler: ticketUrlChangedHandler,
        inputBlurHandler: ticketUrlBlurHandler,
        resetFunction: resetTicketUrlFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: address,
        isValid: addressIsValid,
        hasError: addressInputHasError,
        valueChangedHandler: addressChangedHandler,
        inputBlurHandler: addressBlurHandler,
        resetFunction: resetAddressFunction,
    } = useInput((value) => value.trim() !== '');


    let formIsValid = false;
    if (titleIsValid && dateStartIsValid) {
        formIsValid = true;
    } else {
        formIsValid = false;
    }
    const handleAddCompetitorInput = () => {
        setCompetitorsFields([...competitorsFields, '']);
    };
    const handleCompetitorInputChange = (index, value) => {
        const updatedInputFields = [...competitorsFields];
        updatedInputFields[index] = value;
        setCompetitorsFields(updatedInputFields);
    };

    const handleAddGuestInput = () => {
        setGuestsInputFields([...guestsInputFields, '']);
    };

    const handleGuestInputChange = (index, value) => {
        const updatedInputFields = [...guestsInputFields];
        updatedInputFields[index] = value;
        setGuestsInputFields(updatedInputFields);
    };
    const handleAddInput = () => {
        setSponsorInputFields([...sponsorInputFields, '']);
    }
    const resetGuestList = () => {
        setGuestsInputFields(['']);
    }
    const resetCompetitorList = () => {
        setCompetitorsFields(['']);
    }
    const resetSponsorList = () => {
        setSponsorInputFields(['']);
    }

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }
    // const reset
    const handleInputChange = (index, value) => {
        const updatedInputFields = [...sponsorInputFields];
        updatedInputFields[index] = value;
        setSponsorInputFields(updatedInputFields);
    };
    const formSubmissionHandler = async (event) => {
        event.preventDefault();
        await checkTokenAndRefresh();


        while (sponsorInputFields[sponsorInputFields.length - 1] === '') {
            sponsorInputFields.pop();
        }
        while (guestsInputFields[guestsInputFields.length - 1] === '') {
            guestsInputFields.pop();
        }
        while (competitorsFields[competitorsFields.length - 1] === '') {
            competitorsFields.pop();
        }

        // console.log("guests " + guestsInputFields);
        // console.log("sponsors " + sponsorInputFields);

        // if (!titleIsValid || !dateStartIsValid) {
        //     return;
        // }
        let dateTimeMilliSeconds = new Date(dateStart);
        let convertedDateStart = dateTimeMilliSeconds.toISOString();
        let dateTimeMilliSecondsEnd = new Date(endingDate);
        let convertedDateEnd = dateTimeMilliSecondsEnd.toISOString();

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("imageRequest", image);
        })
        const imgResponse = await axios.post('https://localhost:7085/Image/onlyfiles', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        setImages(imgResponse.data);
        console.log(imgResponse)
        let payload = {
            title: title,
            description: description,
            startingDate: convertedDateStart,
            endingDate: convertedDateEnd,
            imageUrls: images,
            guests: guestsInputFields,
            competitors: competitorsFields,
            capacity: capacity,
            ticketPrice: ticketPrice,
            ticketUrl: ticketUrl,
            sponsors: sponsorInputFields,
            locationId: selectedLocation,
            categoryId: selectedCategory,
            street: address,
            latitude: marker.lat,
            longitude: marker.lng,
        };
        console.log(payload);

        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/events`, payload, {headers: header});
        console.log(response);

        // console.log(imgResponse.data);
        // setImages(imgResponse.data);
        // resetTitleFunction();
        // resetDateStartFunction();
        // resetEndingDateFunction();
        // resetGuestList();
        // resetCompetitorList();
        // resetSponsorList();
        // resetCapacityFunction();
        // resetTicketPriceFunction();
        // resetTicketUrlFunction();

    };


    return (
        <>
            <div className={"div-container"}>

                <form className={"forma-event"} onSubmit={formSubmissionHandler}>

                    <div className={"right-side-form"}>

                        <p className={"main-text"}>Add en Event!</p>
                        <Input
                            label={"Title"}
                            type="text"
                            id="titleEvent"
                            value={title}
                            onChange={titleChangedHandler}
                            onBlur={titleBlurHandler}
                            isNotValid={titleInputHasError}
                            className={classes["input-form"]}
                            isRequeired={true}
                        ></Input>
                        {titleInputHasError && (
                            <label className={classes["error-text"]}>
                                Invalid name!
                            </label>
                        )}
                        <div className={classes2["desc-div"]}>
                            <label>Description</label>
                            <textarea
                                onChange={handleDescriptionOnChange}
                                className={classes2["description-area"]}
                            />
                        </div>

                        <div className={"two-in-row"}>

                            <Input
                                label={"Starting date"}
                                type="datetime-local"
                                id="dateStart"
                                value={dateStart}
                                onChange={dateStartChangedHandler}
                                onBlur={dateStartBlurHandler}
                                isNotValid={dateStartInputHasError}
                                className={classes["input-form"]}
                                isRequeired={true}
                            ></Input>
                            {dateStartInputHasError && (
                                <label className={classes["error-text"]}>
                                    Invalid starting date!
                                </label>
                            )}
                            <Input
                                label={"Ending date"}
                                type="datetime-local"
                                id="endingDate"
                                value={endingDate}
                                onChange={endingDateChangedHandler}
                                onBlur={endingDateBlurHandler}
                                isNotValid={endingDateInputHasError}
                                className={classes["input-form"]}
                                isRequeired={true}
                            ></Input>
                            {endingDateInputHasError && (
                                <label className={classes["error-text"]}>
                                    Invalid ending date!
                                </label>
                            )}
                        </div>

                        <div className={"adding-inputs"}>
                            {guestsInputFields.map((input, index) => (
                                <Input
                                    key={index}
                                    label={`Guest ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleGuestInputChange(index, event.target.value)}
                                    className={classes["input-form"]}
                                />
                            ))}

                            <Button
                                type={"button"}
                                onClick={handleAddGuestInput}
                                className={classes["login-button"]}
                            >
                                Add Guest Input
                            </Button>
                        </div>

                        <div className={"adding-inputs"}>
                            {competitorsFields.map((input, index) => (
                                <Input
                                    key={index}
                                    label={`Competitor ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleCompetitorInputChange(index, event.target.value)}
                                    className={classes["input-form"]}
                                />
                            ))}
                            <Button
                                type={"button"}
                                onClick={handleAddCompetitorInput}
                                className={classes["login-button"]}
                            >
                                Add Competitor Input
                            </Button>
                        </div>
                        <Input
                            label="Capacity"
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={capacityChangedHandler}
                            onBlur={capacityBlurHandler}
                            isNotValid={capacityInputHasError}
                            className={classes["input-form"]}
                            isRequeired={true}
                        ></Input>
                        {capacityInputHasError && (
                            <label className={classes["error-text"]}>
                                Invalid capacity!
                            </label>
                        )}
                        <div className={"two-in-row"}>
                            <Input
                                label="Ticket Price"
                                type="number"
                                id="ticketPrice"
                                value={ticketPrice}
                                onChange={ticketPriceChangedHandler}
                                className={classes["input-form"]}
                            ></Input>
                            <Input
                                label="Ticket URL"
                                type="text"
                                id="ticketUrl"
                                value={ticketUrl}
                                onChange={ticketUrlChangedHandler}
                                className={classes["input-form"]}
                            ></Input>
                        </div>

                        <div className={"adding-inputs"}>
                            {sponsorInputFields.map((input, index) => (
                                <Input
                                    key={index}
                                    label={`Sponsor ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleInputChange(index, event.target.value)}
                                    className={classes["input-form"]}
                                />
                            ))}

                            <Button
                                type={"button"}
                                onClick={handleAddInput}
                                className={classes["login-button"]}
                            >
                                Add Sponsor
                            </Button>
                        </div>

                        <div className={"two-in-row"}>
                            <select
                                value={selectedLocation}
                                onChange={(event) => setSelectedLocation(event.target.value)}
                                className={classes["input-form"]}>
                                <option value="">Select Location</option>
                                {allLocations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                className={classes["input-form"]}>
                                <option value="">Select Category</option>
                                {allCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Address"
                            type="text"
                            id="address"
                            value={address}
                            onChange={addressChangedHandler}
                            onBlur={addressBlurHandler}
                            isNotValid={addressInputHasError}
                            className={classes["input-form"]}
                            isRequeired={true}
                        ></Input>
                        {addressInputHasError && (
                            <label className={classes["error-text"]}>
                                Invalid address!
                            </label>
                        )}

                        <input
                            type={"file"}
                            multiple
                            onChange={(event) => {
                                const files = Array.from(event.target.files);
                                setImages(files);
                            }}
                        />

                        <Button
                            type={"submit"}
                            className={classes["login-button"]}
                            // disabled={!formIsValid}
                        >
                            Add an event
                        </Button>


                    </div>
                    <div className={"left-side-form"}>
                        <Map setMarker={setMarker}/>
                    </div>


                </form>
            </div>
        </>
    );
}
export default AddEventForm;