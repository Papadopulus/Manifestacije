import React, {useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
const EditUserBox = ({ message, onConfirm ,onCancel,name ,surname}) => {

    // const [currentNameChange, setCurrentNameChange] = useState(name);
    // console.log(name);
    const {
        value: nameChange,
        isValid:enteredNameIsValid,
        hasError : NameError,
        valueChangedHandler: nameChangeChangeHandler,
        inputBlurHandler: NameBlurHandler,
        resetFunction: resetNameChangeFunction,
    } = useInput((value) => value.trim() !== '',name);

    const {
        value: surnameChange,
        isValid:enteredSurnameIsValid,
        hasError : surnameError,
        valueChangedHandler: surnameChangeChangeHandler,
        inputBlurHandler:surnameBlurHandler,
        resetFunction: resetSurnameChangeFunction,
    } = useInput((value) => value.trim() !== '',surname);

    let formIsValid = false;
    if (enteredSurnameIsValid && enteredNameIsValid) {
        formIsValid = true;
    } else {
        formIsValid = false;
    }
    
    let payload = {
        firstName: nameChange,
        lastName : surnameChange,
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
                    value={nameChange}
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
                    value={surnameChange}
                    onChange={surnameChangeChangeHandler}
                    onBlur = {surnameBlurHandler}
                    isNotValid = {surnameError}
                ></Input>
                {surnameError && (
                    <label className={classes["error-text"]}>
                        must enter a surname!
                    </label>
                )}
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`}
                            onClick={() => {
                                if (!enteredNameIsValid || !enteredSurnameIsValid)
                                {
                                    return;
                                }
                        onConfirm(payload)
                    }} disabled={!formIsValid}>
                        Yes
                    </button>
                    
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditUserBox;

