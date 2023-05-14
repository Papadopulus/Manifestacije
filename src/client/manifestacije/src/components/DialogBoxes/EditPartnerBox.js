import React from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
const EditPartnerBox = ({ message, onConfirm ,onCancel }) => {

    const {
        value: name,
        isValid:enteredNameIsValid,
        hasError : NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: phone,
        isValid:enteredPhoneIsValid,
        hasError : surnameError,
        valueChangedHandler: phoneChangeChangeHandler,
        inputBlurHandler:phoneBlurHandler,
        resetFunction: resetPhoneChangeFunction,
    } = useInput((value) => value.trim() !== '');

    let payload = {
        name: name,
        phoneNumber : phone,
    }

    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={"Change name"}
                    type="text"
                    id="nameChange"
                    value={name}
                    onChange={nameChangeChangeHandler}
                    onBlur = {NameBlurHandler}
                    isNotValid = {NameError}
                ></Input>
                {NameError && (
                    <label className={classes["error-text"]}>
                        must enter a name!
                    </label>
                )}
                <Input
                    label={"Change surname"}
                    type="text"
                    id="surnameChange"
                    value={phone}
                    onChange={phoneChangeChangeHandler}
                    onBlur = {phoneBlurHandler}
                    isNotValid = {surnameError}
                ></Input>
                {surnameError && (
                    <label className={classes["error-text"]}>
                        must enter a surname!
                    </label>
                )}
                <div className={classes["buttons"]}>
                    <button onClick={() => onConfirm(payload)}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditPartnerBox;

