import React from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
const EditNameBox = ({ message, onConfirm ,onCancel }) => {

    const {
        value: nameCat,
        isValid:enteredNameIsValid,
        hasError : NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '');

    let payload = {
        name: nameCat,
    }

    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={"Change name"}
                    type="text"
                    id="nameChangeCat"
                    value={nameCat}
                    onChange={nameChangeChangeHandler}
                    onBlur = {NameBlurHandler}
                    isNotValid = {NameError}
                ></Input>
                {NameError && (
                    <label className={classes["error-text"]}>
                        must enter a name!
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

export default EditNameBox;

