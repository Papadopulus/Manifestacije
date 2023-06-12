import React from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
const EditNameBox = ({ message, onConfirm ,onCancel ,name,fromAdd}) => {

    
    const {
        value: nameCat,
        isValid:enteredNameIsValid,
        hasError : NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '',name);

    let formIsValid = false;
    if (enteredNameIsValid) {

        formIsValid = true;
    } else {
        formIsValid = false;
    }
    let payload = {
        name: nameCat,
    }

    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={fromAdd ?  "Ime" : "Promeni ime"}
                    type="text"
                    id="nameChangeCat"
                    value={nameCat}
                    onChange={nameChangeChangeHandler}
                    onBlur = {NameBlurHandler}
                    isNotValid = {NameError}
                ></Input>
                {NameError && (
                    <label className={classes["error-text"]}>
                        Niste uneli ime!
                    </label>
                )}
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`} 
                            onClick={() => {
                                if (!enteredNameIsValid)
                                {
                                    return;
                                }
                        onConfirm(payload)
                    }} disabled={!formIsValid}>
                        Prihvati
                    </button>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>Odbaci</button>
                </div>
            </div>
        </>
    );
};

export default EditNameBox;

