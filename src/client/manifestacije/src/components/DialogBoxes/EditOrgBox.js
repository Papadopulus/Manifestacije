import React from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
const EditOrgBox = ({ message, onConfirm ,onCancel }) => {

    const {
        value: desc,
        valueChangedHandler: descOrgChangeHandler,
        resetFunction: resetDescFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: enteredFBOrg,
        valueChangedHandler: FBChangeHandler,
        resetFunction: resetFBFunction,
    } = useInput((value) => value.trim() !== '');

    //2
    const {
        value: twitterOrg,
        valueChangedHandler: twitterChangeHandler,
        resetFunction: resetTwitterFunction,
    } = useInput((value) => value.trim() !== '');
    //3
    const {
        value: instagramOrg,
        valueChangedHandler: instagramOrgChangeHandler,
        resetFunction: resetInstagramFunction,
    } = useInput((value) => value.trim() !== '');
    //4
    const {
        value: youtubeOrg,
        valueChangedHandler: youtubeOrgChangeHandler,
        resetFunction: resetYoutubeFunction,
    } = useInput((value) => value.trim() !== '');
    //5
    const {
        value: linkedinOrg,
        valueChangedHandler: linkedinOrgChangeHandler,
        resetFunction: resetLinkedinFunction,
    } = useInput((value) => value.trim() !== '');
    //6
    const {
        value: websiteUrl,
        valueChangedHandler: websiteUrlOrgChangeHandler,
        resetFunction: resetWebsiteUrlFunction,
    } = useInput((value) => value.trim() !== '');
    //7
    const {
        value: logoUrl,
        valueChangedHandler: logoUrlOrgChangeHandler,
        resetFunction: resetLogoUrlFunction,
    } = useInput((value) => value.trim() !== '');

    let payload = {
        description:desc, 
        logoUrl: logoUrl,
        websiteUrl: websiteUrl,
        facebookUrl: enteredFBOrg,
        instagramUrl: instagramOrg,
        twitterUrl: twitterOrg,
        youtubeUrl: youtubeOrg,
        linkedInUrl: linkedinOrg,
    }

    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{message}</p>
                <Input
                    label={"Description"}
                    type="text"
                    id="descOrg"
                    value={desc}
                    onChange={descOrgChangeHandler}
                ></Input>

                <Input
                    label={"Logo URL"}
                    type="text"
                    id="logoUrlOrg"
                    value={logoUrl}
                    onChange={logoUrlOrgChangeHandler}
                ></Input>

                <Input
                    label={"Website URL"}
                    type="text"
                    id="websiteUrlOrg"
                    value={websiteUrl}
                    onChange={websiteUrlOrgChangeHandler}
                ></Input>

                <Input
                    label={"Facebook link"}
                    type="text"
                    id="fbLInkOrg"
                    value={enteredFBOrg}
                    onChange={FBChangeHandler}
                >
                </Input>

                <Input
                    label={"Instagram link"}
                    type="text"
                    id="instagramLinkOrg"
                    value={instagramOrg}
                    onChange={instagramOrgChangeHandler}
                ></Input>

                <Input
                    label={"Twitter link"}
                    type="text"
                    id="twitterLinkOrg"
                    value={twitterOrg}
                    onChange={twitterChangeHandler}
                ></Input>

                <Input
                    label={"YouTube link"}
                    type="text"
                    id="youtubeLinkOrg"
                    value={youtubeOrg}
                    onChange={youtubeOrgChangeHandler}
                ></Input>

                <Input
                    label={"LinkedIn link"}
                    type="text"
                    id="linkedinLinkOrg"
                    value={linkedinOrg}
                    onChange={linkedinOrgChangeHandler}
                ></Input>
                <div className={classes["buttons"]}>
                    <button onClick={() => onConfirm(payload)}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditOrgBox;

