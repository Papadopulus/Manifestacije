import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import classes from "../Login/LoginInput.module.css";
import Button from "../UI/Button/Button";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import ChangeProfile from "../User/ChangeProfile";
import {useEffect, useRef, useState} from "react";


const AddEventForm = (props) => {

    const [sponsorInputFields, setSponsorInputFields] = useState([''])
    const [guestsInputFields, setGuestsInputFields] = useState(['']);
    const [competitorsFields, setCompetitorsFields] = useState(['']);
    const [allLocations, setAllLocations] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

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
    const handleInputChange = (index, value) => {
        const updatedInputFields = [...sponsorInputFields];
        updatedInputFields[index] = value;
        setSponsorInputFields(updatedInputFields);
    };
    const formSubmissionHandler = async (event) => {
        event.preventDefault();


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
        let payload = {
            title: title,
            startingDate: dateStart,
            endingDate: endingDate,
            guests: guestsInputFields,
            competitors: competitorsFields,
            capacity: capacity,
            ticketPrice: ticketPrice,
            ticketUrl: ticketUrl,
            sponsors: sponsorInputFields,
            locationId: selectedLocation,
            categoryId:selectedCategory,
        };
        // await checkTokenAndRefresh();
        // let header = {
        //     "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        // }
        // const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${props.id}`,payload,{headers:header});
        // props.setUser(response.data);
        resetTitleFunction();
        resetDateStartFunction();
    };
    return (
        <>
            <form onSubmit={formSubmissionHandler}>
                <p className={"main-text"}>Add en Event!</p>
                <Input
                    label={"Title"}
                    type="text"
                    id="name"
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
                <Input
                    label={"Starting date"}
                    type="date"
                    id="surname"
                    value={dateStart}
                    onChange={dateStartChangedHandler}
                    onBlur={dateStartBlurHandler}
                    isNotValid={dateStartInputHasError}
                    className={classes["input-form"]}
                    isRequeired={true}
                ></Input>
                {dateStartInputHasError && (
                    <label className={classes["error-text"]}>
                        Invalid title!
                    </label>
                )}
                <Input
                    label={"Ending date"}
                    type="date"
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

                <Input
                    label="Capacity"
                    type="number"
                    id="capacity"
                    value={capacity}
                    onChange={capacityChangedHandler}
                    onBlur={capacityBlurHandler}
                    isNotValid={capacityInputHasError}
                    className={classes["input-form"]}
                ></Input>
                {capacityInputHasError && (
                    <label className={classes["error-text"]}>
                        Invalid capacity!
                    </label>
                )}
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

                {sponsorInputFields.map((input, index) => (
                    <Input
                        key={index}
                        label={`Input ${index + 1}`}
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
                    Add Input
                </Button>

                <Button
                    type={"submit"}
                    className={classes["login-button"]}
                    // disabled={!formIsValid}
                >
                    Add an event
                </Button>
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
            </form>
        </>
    );
}
export default AddEventForm;