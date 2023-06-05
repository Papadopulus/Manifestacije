import React from "react";
import classes from "./CustomBox.module.css";

const ViewUserBox = ({ message, onCancel,wholeUser }) => {
    
    const createdDate = new Date(wholeUser.createdAtUtc);
    const formattedDate = createdDate.toLocaleString();
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <p> Id: {wholeUser.id}</p>
                <p> First Name: {wholeUser.firstName}</p>
                <p> Last Name: {wholeUser.lastName}</p>
                <p> E-mail: {wholeUser.email}</p>
                <p> Joined: {formattedDate}</p>     
                <p> Role: {wholeUser.roles[0]}</p>
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </>
    );
};

export default ViewUserBox;

