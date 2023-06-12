import React from "react";
import classes from "./DialogBoxHandle.module.css";

const ViewBox = (props) => {
    
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                {/*<p>{message}</p>*/}
                {props.children}
                {/*<p> Id: {wholeData.id}</p>*/}
                {/*<p> Name: {wholeData.name}</p>*/}
                {/*<p> Added on: {formattedDate}</p>*/}
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={props.onCancel}>Zatvori</button>
                </div>
            </div>
        </>
    );
};

export default ViewBox;

