import React, {useEffect, useRef, useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";

const EditLocationBox = ({message, onConfirm, onCancel, name}) => {
    
    const shouldLog = useRef(true);
    const shouldShowAccom = useRef(true);
    const shouldShow= useRef(true);
    
    const [allPartners, setAllPartners] = useState([]);
    const [selectedAccomodation, setSelectedAccomodation] = useState('');
    const [selectedTransport, setSelectedTransport] = useState('');


    const {
        value: nameCat,
        isValid: enteredNameIsValid,
        hasError: NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '', name);

    let formIsValid = false;
    if (enteredNameIsValid) {
        formIsValid = true;
    } else {
        formIsValid = false;
    }

    let payload = {
        name: nameCat,
        accommodationPartnerId: selectedAccomodation=== "" ? null : selectedAccomodation,
        transportPartnerId: selectedTransport === "" ? null : selectedTransport
    }

    // console.log(selectedAccomodation)
    const getAllPartners = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/partners`, {headers: header})
        setAllPartners(response.data);
    }
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            getAllPartners();
        }
        return () => {
            shouldLog.current = false;
        }

    }, [])

    return (
        <>
            <div className={classes["custom-dialog-overlay"]}/>
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={"Ime lokacije"}
                    type="text"
                    id="nameChangeCat"
                    value={nameCat}
                    onChange={nameChangeChangeHandler}
                    onBlur={NameBlurHandler}
                    isNotValid={NameError}
                ></Input>
                {NameError && (
                    <label className={classes["error-text"]}>
                        Unesite ime!
                    </label>
                )}
                <div className={classes.dvaSelekta}>
                    <select
                        value={selectedAccomodation}
                        onChange={(event) => {
                            shouldShowAccom.current = false;
                            setSelectedAccomodation(event.target.value)
                        }}
                        className={classes["selections"]}>
                        {shouldShowAccom.current && <option value="">Partner smestaja</option>}
                        {allPartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                                {partner.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedTransport}
                        onChange={(event) => {
                            shouldShow.current = false;
                            setSelectedTransport(event.target.value)
                        }}
                        className={classes["selections"]}>
                        {shouldShow.current && <option value="">Partner transporta</option>}
                        {allPartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                                {partner.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`}
                            onClick={() => {
                                if (!enteredNameIsValid){
                                    return;
                                }
                                onConfirm(payload)
                            }} disabled={!formIsValid}>Prihvati
                    </button>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>Odbaci</button>
                </div>
            </div>
        </>
    );
};

export default EditLocationBox;

