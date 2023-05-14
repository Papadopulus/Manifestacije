import React from "react";
import classes from "./CustomBox.module.css";

const ViewPartnerBox = ({ message, onCancel,wholeData }) => {

    const createdDate = new Date(wholeData.createdAtUtc);
    const formattedDate = createdDate.toLocaleString();
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <p> Id: {wholeData.id}</p>
                <p> Name: {wholeData.name}</p>
                <p> Phone: { wholeData.phoneNumber}</p>
                <p> Added on: {formattedDate}</p>
                <div className={classes["buttons"]}>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </>
    );
};

export default ViewPartnerBox;

