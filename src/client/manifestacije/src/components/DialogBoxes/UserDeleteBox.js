import React from "react";
import classes from "./UserDeleteBox.module.css";

const CustomDialogBox = ({ message, onConfirm, onCancel }) => {
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <div className={classes["buttons"]}>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default CustomDialogBox;

