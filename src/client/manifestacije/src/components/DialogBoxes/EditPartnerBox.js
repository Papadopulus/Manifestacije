﻿import React, {useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";

const EditPartnerBox = ({message, onConfirm, onCancel}) => {

    const [isAccommodation,setIsAccommodation] = useState(false);
    const [isTransport,setIsTransport] = useState(false);
    const {
        value: name,
        isValid: enteredNameIsValid,
        hasError: NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: phone,
        isValid: enteredPhoneIsValid,
        hasError: surnameError,
        valueChangedHandler: phoneChangeChangeHandler,
        inputBlurHandler: phoneBlurHandler,
        resetFunction: resetPhoneChangeFunction,
    } = useInput((value) => value.trim() !== '');

    
    let payload = {
        name: name,
        phoneNumber: phone,
        isTransport:isTransport,
        isAccommodation:isAccommodation
    }
    // console.log(payload);
    return (
        <>
            <div className={classes["custom-dialog-overlay"]}/>
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={"Change name"}
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
                    label={"Change phone number"}
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
                <div className={classes["check-div"]}>
                    <div>
                        <label>Set as Accomodation partner</label>
                        <input 
                            className={classes["accomodation-check"]} 
                            type={"checkbox"}
                            checked={isAccommodation}
                            onChange={(event)=> setIsAccommodation(event.target.checked)}
                        />
                    </div>
                    <div>
                        <label>Set as Transport partner</label>
                        <input 
                            className={classes["transport-check"]} 
                            type={"checkbox"}
                            checked={isTransport}
                            onChange={(event)=> {setIsTransport(event.target.checked)}}
                        />
                    </div>
                    
                </div>

                <div className={classes["buttons"]}>
                    <button onClick={() => onConfirm(payload)}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditPartnerBox;

