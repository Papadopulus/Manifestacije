import React, {useEffect, useRef, useState} from "react";
import classes from "./CustomBox.module.css";
import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import TextArea from "../../components/UI/TextArea/TextArea";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
const EditOrgBox = (props) => {

    const [images, setImages] = useState([props.logo]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageURL, setSelectedImageURL] = useState(null);
    
    const shouldLog = useRef(true);
    const loadImage = async () => {
        try {
            const imageResponse = await axios.get(
                `https://localhost:7085/Image/${props.logo}`,
                { responseType: "blob" }
            );
            const reader = new FileReader();
            reader.onloadend = function () {
                setSelectedImageURL(reader.result);
            };
            reader.readAsDataURL(imageResponse.data);
        } catch (error) {
            console.error("Error retrieving the image:", error);
        }
    };
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            loadImage();
        }
        return () => {
            shouldLog.current = false;
        };
    }, []);

    useEffect(() => {
        if (selectedImage) {
            const imageUrl = URL.createObjectURL(selectedImage);
            setSelectedImageURL(imageUrl);
            console.log(imageUrl);
        }
    }, [selectedImage]);

    useEffect(() => {
        return () => {
            if (selectedImageURL) {
                URL.revokeObjectURL(selectedImageURL);
            }
        };
    }, [selectedImageURL]);

    const {
        value: desc,
        valueChangedHandler: descOrgChangeHandler,
        resetFunction: resetDescFunction,
    } = useInput((value) => value.trim() !== '',props.desc);

    const {
        value: enteredFBOrg,
        valueChangedHandler: FBChangeHandler,
        resetFunction: resetFBFunction,
    } = useInput((value) => value.trim() !== '',props.facebook);

    //2
    const {
        value: twitterOrg,
        valueChangedHandler: twitterChangeHandler,
        resetFunction: resetTwitterFunction,
    } = useInput((value) => value.trim() !== '',props.twiter);
    //3
    const {
        value: instagramOrg,
        valueChangedHandler: instagramOrgChangeHandler,
        resetFunction: resetInstagramFunction,
    } = useInput((value) => value.trim() !== '',props.instagram);
    //4
    const {
        value: youtubeOrg,
        valueChangedHandler: youtubeOrgChangeHandler,
        resetFunction: resetYoutubeFunction,
    } = useInput((value) => value.trim() !== '',props.youtube)
    //5
    const {
        value: linkedinOrg,
        valueChangedHandler: linkedinOrgChangeHandler,
        resetFunction: resetLinkedinFunction,
    } = useInput((value) => value.trim() !== '',props.linkedin);
    //6
    const {
        value: websiteUrl,
        valueChangedHandler: websiteUrlOrgChangeHandler,
        resetFunction: resetWebsiteUrlFunction,
    } = useInput((value) => value.trim() !== '',props.website);
    //7
    const {
        value: logoUrl,
        valueChangedHandler: logoUrlOrgChangeHandler,
        resetFunction: resetLogoUrlFunction,
    } = useInput((value) => value.trim() !== '',props.logo);

    

    const handleEditOrganisation = async () => {
        await checkTokenAndRefresh();

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("imageRequest", image);
        });
        const imgResponse = await axios.post(
            "https://localhost:7085/Image/onlyfiles",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(imgResponse.data[0])

        let payload = {
            description:desc,
            logoUrl: imgResponse.data[0],
            websiteUrl: websiteUrl,
            facebookUrl: enteredFBOrg,
            instagramUrl: instagramOrg,
            twitterUrl: twitterOrg,
            youtubeUrl: youtubeOrg,
            linkedInUrl: linkedinOrg,
        }
        console.log(imgResponse.data[0]);
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/organizations/${props.organisationEdit.id}`, payload, {headers: header})
        console.log(response);
        const updatedOrganisation = response.data;
        const updatedOranisationsList = props.allOrganisations.map(org => org.id === updatedOrganisation.id ? updatedOrganisation : org);
        props.setAllOrganisations(updatedOranisationsList);
        props.setOrganisationEdit(null);
    }

    return (
        <>
            <div className={classes["custom-dialog-overlay"]} />
            <div className={classes["custom-dialog-box"]}>
                <p>{props.message}</p>
                <TextArea
                    label={"Description"}
                    id="descOrg"
                    value={desc}
                    onChange={descOrgChangeHandler}
                ></TextArea>
                
                <Input
                    label={"Logo URL"}
                    type="text"
                    id="logoUrlOrg"
                    value={logoUrl}
                    onChange={logoUrlOrgChangeHandler}
                ></Input>

                <div className={classes["upload-div"]}>
                    <p className={classes["upload-logo"]}>Upload your logo here</p>

                    <div className={`${classes["choose-file"]}`}>
                        <label className={classes["choose-file-label"]}>
                            {selectedImageURL ? (
                                <img
                                    src={selectedImageURL}
                                    className={classes["choose-file-image"]}
                                />
                            ) : null}
                            <span className={`${classes["choose-file-icon"]}`}>+</span>
                            <input
                                type="file"
                                onChange={async (event) => {
                                    const files = Array.from(event.target.files);
                                    if (files.length > 0) {
                                        setSelectedImage(files[0]);
                                        setImages(files);
                                        setSelectedImageURL(null);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

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
                    {/*<button onClick={() => props.onConfirm(payload)}>Yes</button>*/}
                    <button onClick={handleEditOrganisation}>Yes</button>
                    <button onClick={props.onCancel}>No</button>
                </div>
            </div>
        </>
    );
};

export default EditOrgBox;

