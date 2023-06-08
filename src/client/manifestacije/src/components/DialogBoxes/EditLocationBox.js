import React, {useEffect, useRef, useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";

const EditLocationBox = ({message, onConfirm, onCancel, name}) => {
    
    const shouldLog = useRef(true);
    
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

    let payload = {
        name: nameCat,
        accommodationPartnerId: selectedAccomodation,
        transportPartnerId: selectedTransport
    }

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
                        must enter a name!
                    </label>
                )}
                <div className={classes.dvaSelekta}>
                    <select
                        value={selectedAccomodation}
                        onChange={(event) => setSelectedAccomodation(event.target.value)}
                        className={classes["selections"]}>
                        <option value="">Partner smestaja</option>
                        {allPartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                                {partner.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedTransport}
                        onChange={(event) => setSelectedTransport(event.target.value)}
                        className={classes["selections"]}>
                        <option value="">Partner transporta</option>
                        {allPartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                                {partner.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`}
                            onClick={() => onConfirm(payload)}>Yes
                    </button>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditLocationBox;

