import React from "react";
import classes from "./CustomBox.module.css";

const ViewBoxOrg = ({ message, onCancel,wholeData }) => {

    const createdDate = new Date(wholeData.createdAtUtc);
    const formattedDate = createdDate.toLocaleString();
    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <p> Id: {wholeData.id}</p>
                <p> Name: {wholeData.name}</p>
                <p> Description : {wholeData.description}</p>
                <p> Website : { wholeData.websiteUrl}</p>
                <p> Facebook : {wholeData.facebookUrl}</p>
                <p> Instagram: {wholeData.instagramUrl}</p>
                <p> Twitter: {wholeData.twitterUrl}</p>
                <p> Youtube: {wholeData.youtubeUrl}</p>
                <p> LinkedIn :{wholeData.linkedInUrl}</p>
                <p> Added on: {formattedDate}</p>
                <div className={classes["buttons"]}>
                    <button className={`${classes.btn} ${classes["button-discard"]}`} onClick={onCancel}>Zatvori</button>
                </div>
            </div>
        </>
    );
};

export default ViewBoxOrg;

