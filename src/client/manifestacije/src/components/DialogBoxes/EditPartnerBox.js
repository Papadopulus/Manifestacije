﻿import React, {useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";

const EditPartnerBox = ({message, onConfirm, onCancel, partName, phoneNumber, Transport, Accomodation, fromAdd}) => {

    const [isAccommodation, setIsAccommodation] = useState(Accomodation ? Accomodation : false);
    const [isTransport, setIsTransport] = useState(Transport ? Transport : false);
    const {
        value: name,
        isValid: enteredNameIsValid,
        hasError: NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '', partName);

    const {
        value: phone,
        isValid: enteredPhoneIsValid,
        hasError: surnameError,
        valueChangedHandler: phoneChangeChangeHandler,
        inputBlurHandler: phoneBlurHandler,
        resetFunction: resetPhoneChangeFunction,
    } = useInput((value) => value.trim() !== '', phoneNumber);

    const {
        value: email,
        isValid: enteredEmailIsValid,
        hasError: emailError,
        valueChangedHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        resetFunction: resetEmailFunction,
    } = useInput((value) => value.trim() !== '');
    const {
        value: url,
        isValid: enteredUrlIsValid,
        hasError: urlError,
        valueChangedHandler: urlChangeHandler,
        inputBlurHandler: urlBlurHandler,
        resetFunction: resetUrlFunction,
    } = useInput((value) => value.trim() !== '');

    let formIsValid = false;
    if (enteredNameIsValid && enteredPhoneIsValid) {
        if (fromAdd){
            if (enteredEmailIsValid && enteredUrlIsValid) {
                formIsValid = true;
            }
            else {
                formIsValid = false;
            }
        }
        else {
            formIsValid = true;
        }
    } else {
        formIsValid = false;
    }
    
    let payload = {
        name: name,
        phoneNumber: phone,
        isTransport: isTransport,
        isAccommodation: isAccommodation
    }
    if (fromAdd) {
        payload = {
            ...payload,
            email: email,
            url: url
        };
    }
    // console.log(payload);
    return (
        <>
            <div className={classes["custom-dialog-overlay"]}/>
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={fromAdd ? "Ime partnera" : "Promeni ime"}
                    type="text"
                    id="nameChange"
                    value={name}
                    onChange={nameChangeChangeHandler}
                    onBlur={NameBlurHandler}
                    isNotValid={NameError}
                ></Input>
                {NameError && (
                    <label className={classes["error-text"]}>
                        must enter a name!
                    </label>
                )}
                <Input
                    label={fromAdd ? "Broj telefona" : "Promeni telefon"}
                    type="text"
                    id="surnameChange"
                    value={phone}
                    onChange={phoneChangeChangeHandler}
                    onBlur={phoneBlurHandler}
                    isNotValid={surnameError}
                ></Input>
                {surnameError && (
                    <label className={classes["error-text"]}>
                        must enter a surname!
                    </label>
                )}
                {fromAdd &&
                    (<div>
                            <Input
                                label="Email"
                                type="text"
                                id="emailInput"
                                value={email}
                                onChange={emailChangeHandler}
                                onBlur={emailBlurHandler}
                                isNotValid={emailError}
                            />
                            {emailError && (
                                <label className={classes["error-text"]}>
                                    Please enter a valid email address.
                                </label>
                            )}
                            <Input
                                label="URL"
                                type="text"
                                id="urlInput"
                                value={url}
                                onChange={urlChangeHandler}
                                onBlur={urlBlurHandler}
                                isNotValid={urlError}
                            />
                            {urlError && (
                                <label className={classes["error-text"]}>
                                    Please enter a valid URL.
                                </label>
                            )}
                        </div>
                    )
                }
                <div className={classes["check-div"]}>
                    <div className={classes.checkBoxDiv}>
                        <label>Set as Accomodation partner</label>
                        <input
                            className={classes["accomodation-check"]}
                            type={"checkbox"}
                            checked={isAccommodation}
                            onChange={(event) => setIsAccommodation(event.target.checked)}
                        />
                    </div>
                    <div className={classes.checkBoxDiv}>
                        <label>Set as Transport partner</label>
                        <input
                            className={classes["transport-check"]}
                            type={"checkbox"}
                            checked={isTransport}
                            onChange={(event) => {
                                setIsTransport(event.target.checked)
                            }}
                        />
                    </div>

                </div>

                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`}
                            onClick={() => {
                                if (
                                    !enteredNameIsValid ||
                                    !enteredPhoneIsValid
                                ) {
                                    if (fromAdd) {
                                        if (!enteredEmailIsValid || !enteredUrlIsValid) {
                                            return;
                                        }
                                    }
                                    return;
                                }
                                onConfirm(payload)
                            }} disabled={!formIsValid}>Yes
                    </button>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditPartnerBox;

