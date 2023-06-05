import React from "react";
import classes from "./CustomBox.module.css";

const CustomDialogBox = ({ message, onConfirm, onCancel }) => {
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-confirm"]}`} onClick={onConfirm}>Obrisi</button>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>Ponisti</button>
                </div>
            </div>
        </>
    );
};

export default CustomDialogBox;

