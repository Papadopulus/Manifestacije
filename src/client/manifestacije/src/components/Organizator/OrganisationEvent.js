import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import classes from "../Login/LoginInput.module.css";
import classes2 from "../Register/RegisterInput.module.css"
import Button from "../UI/Button/Button";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import {useEffect, useRef, useState} from "react";
import Map from "../../GoogleMaps/GPTMaps/GptMapsProba"
import classesEvent from "./OrganisationEvent.module.css"
import uploadImage from "../../multimedia/uploadImage.jpg"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {makeStyles} from '@material-ui/core/styles';
import TextArea from "../UI/TextArea/TextArea";

const useStyles = makeStyles({
    uploadIcon: {
        width: '100%',
        height: '100%',
    },
});
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
    const [imageNames, setImageNames] = useState([]);
    // const [description, setDescription] = useState(null);

    const shouldLog = useRef(true);

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setShowMap(window.innerWidth < 960);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check for the screen width
        handleResize();

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const {
        value: description,
        isValid: descriptionIsValid,
        hasError: descriptionInputHasError,
        valueChangedHandler: descriptionChangedHandler,
        inputBlurHandler: descriptionBlurHandler,
        resetFunction: resetDescriptionFunction,
    } = useInput((value) => value.trim() !== '');

    let formIsValid = false;
    if (titleIsValid && dateStartIsValid && endingDateIsValid
        && capacityIsValid && descriptionIsValid) {
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
    const handleAddSponsor = () => {
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

    // const handleDescriptionOnChange = (event) => {
    //     setDescription(event.target.value);
    // }
    // const reset
    const handleInputChange = (index, value) => {
        const updatedInputFields = [...sponsorInputFields];
        updatedInputFields[index] = value;
        setSponsorInputFields(updatedInputFields);
    };
    const formSubmissionHandler = async (event) => {
        event.preventDefault();
        if (!titleIsValid ||
            !dateStartIsValid ||
            !descriptionIsValid ||
            !endingDateIsValid ||
            !capacityIsValid) {
            return;
        }
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
        // setImageNames(imgResponse.data);
        // console.log(imageNames);
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

    const classes = useStyles();

    return (
        <>
            <div className={classesEvent["div-container"]}>

                <form className={classesEvent["forma-event"]} onSubmit={formSubmissionHandler}>

                    <div className={classesEvent["right-side-form"]}>

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
                            firstLabelColor={'navajowhite'}
                        ></Input>
                        {titleInputHasError && (
                            <label className={classes2["error-text"]}>
                                Invalid name!
                            </label>
                        )}
                        <div className={classesEvent["desc-div"]}>
                            {/*<label>Description</label>*/}
                            {/*<textarea*/}
                            {/*    onChange={handleDescriptionOnChange}*/}
                            {/*    className={classes2["description-area"]}*/}
                            {/*/>*/}
                            <TextArea
                                label={"Description"}
                                id="description"
                                value={description}
                                onChange={descriptionChangedHandler}
                                onBlur={descriptionBlurHandler}
                                isNotValid={descriptionInputHasError}
                                className={classes["input-form"]}
                                isRequeired={true}
                                firstLabelColor={'navajowhite'}
                            />
                            {descriptionInputHasError && (
                                <label className={classes2["error-text"]}>
                                    Invalid Description!
                                </label>
                            )}
                        </div>

                        <div className={classesEvent["two-in-row"]}>

                            <div className={classesEvent["column-in-row"]}>

                                <Input
                                    label={"Starting date"}
                                    type="datetime-local"
                                    id="dateStart"
                                    value={dateStart}
                                    onChange={dateStartChangedHandler}
                                    onBlur={dateStartBlurHandler}
                                    isNotValid={dateStartInputHasError}
                                    className={classesEvent["input-form"]}
                                    isRequeired={true}
                                    firstLabelColor={'navajowhite'}
                                ></Input>
                                {dateStartInputHasError && (
                                    <label className={classes2["error-text"]}>
                                        Invalid starting date!
                                    </label>
                                )}
                            </div>

                            <div className={classesEvent["column-in-row"]}>

                                <Input
                                    label={"Ending date"}
                                    type="datetime-local"
                                    id="endingDate"
                                    value={endingDate}
                                    onChange={endingDateChangedHandler}
                                    onBlur={endingDateBlurHandler}
                                    isNotValid={endingDateInputHasError}
                                    className={classesEvent['input-form']}
                                    isRequeired={true}
                                    firstLabelColor={'navajowhite'}
                                ></Input>
                                {endingDateInputHasError && (
                                    <label className={classes2["error-text"]}>
                                        Invalid ending date!
                                    </label>
                                )}
                            </div>

                        </div>

                        <div className={classesEvent["adding-inputs"]}>
                            {guestsInputFields.map((input, index) => (
                                <Input
                                    key={index}
                                    label={`Guest ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleGuestInputChange(index, event.target.value)}
                                    firstLabelColor={'navajowhite'}
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
                                    label={`Competitor ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleCompetitorInputChange(index, event.target.value)}
                                    className={classes["input-form"]}
                                    firstLabelColor={'navajowhite'}
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
                            label="Capacity"
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={capacityChangedHandler}
                            onBlur={capacityBlurHandler}
                            isNotValid={capacityInputHasError}
                            className={classes["input-form"]}
                            isRequeired={true}
                            firstLabelColor={'navajowhite'}
                        ></Input>
                        {capacityInputHasError && (
                            <label className={classes2["error-text"]}>
                                Invalid capacity!
                            </label>
                        )}
                        <div className={classesEvent["two-in-row"]}>

                            <div className={classesEvent["column-in-row"]}>

                                <Input
                                    label="Ticket Price"
                                    type="number"
                                    id="ticketPrice"
                                    value={ticketPrice}
                                    onChange={ticketPriceChangedHandler}
                                    firstLabelColor={'navajowhite'}
                                    // className={classes["input-form"]}
                                ></Input>
                            </div>
                            <div className={classesEvent["column-in-row"]}>
                                <Input
                                    label="Ticket URL"
                                    type="text"
                                    id="ticketUrl"
                                    value={ticketUrl}
                                    onChange={ticketUrlChangedHandler}
                                    firstLabelColor={'navajowhite'}
                                    // className={classes["input-form"]}
                                ></Input>
                            </div>
                        </div>

                        <div className={classesEvent["adding-inputs"]}>
                            {sponsorInputFields.map((input, index) => (
                                <Input
                                    key={index}
                                    label={`Sponsor ${index + 1}`}
                                    type="text"
                                    value={input}
                                    onChange={(event) => handleInputChange(index, event.target.value)}
                                    className={classes["input-form"]}
                                    firstLabelColor={'navajowhite'}
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

                        <div className={classesEvent["two-in-row"]}>
                            <select
                                value={selectedLocation}
                                onChange={(event) => setSelectedLocation(event.target.value)}
                                className={classesEvent["selections"]}>
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
                                className={classesEvent["selections"]}>
                                <option value="">Select Category</option>
                                {allCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={classesEvent["adr-and-map"]}>
                            <div className={classesEvent["input-address"]}>
                                <Input
                                    label="Address"
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={addressChangedHandler}
                                    onBlur={addressBlurHandler}
                                    isNotValid={addressInputHasError}
                                    className={`${classes["input-form"]}`}
                                    isRequeired={true}
                                    firstLabelColor={'navajowhite'}
                                ></Input>
                                {addressInputHasError && (
                                    <label className={classes2["error-text"]}>
                                        Invalid address!
                                    </label>
                                )}
                            </div>

                            <div className={classesEvent["map-form"]}>
                                <p>Pin your location on the map!</p>
                                <Map setMarker={setMarker}/>
                            </div>

                        </div>
                        <p className={classesEvent["upload-pictures"]}>Click here to upload pictures!</p>
                        <div className={classesEvent["upload-div"]}>

                            <div className={`${classesEvent["choose-file"]}`}>

                                <label className={classesEvent["choose-file-label"]}>
                                    {/*<img src={CloudUploadIcon} alt="Upload Icon" className={classesEvent["upload-icon"]} />*/}
                                    <CloudUploadIcon className={classes.uploadIcon}/>
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
                                {/*{images.map((image, index) => (*/}
                                {/*    <div className={classesEvent["image-div"]} key={index}>*/}
                                {/*        <img className={classesEvent["img"]} src={image}*/}
                                {/*             alt={`Image ${index + 1}`}/>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                                {images.map((image, index) => (
                                    <div className={classesEvent["image-div"]} key={index}>
                                        {image instanceof Blob || image instanceof File ? (
                                            <img className={classesEvent["img"]} src={URL.createObjectURL(image)}
                                                 alt={`Image ${index + 1}`}/>
                                        ) : (
                                            <p>Not a valid image file</p>
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
                            Add an event
                        </Button>


                    </div>
                    {/*{!showMap &&*/}
                    {/*    <div className={classesEvent["left-side-form"]}>*/}
                    {/*        <Map setMarker={setMarker}/>*/}
                    {/*    </div>*/}
                    {/*}*/}


                </form>
            </div>
        </>
    );
}
export default AddEventForm;