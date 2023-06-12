import classes from "./RegisterInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import { Link } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../store/AuthContext";
import Introduction from "../Introduction/Introduction";
import axios from "axios";

const RegisterInput = () => {
  const { register } = useContext(AuthContext);
  const [isOrganisator, setIsOrganisator] = useState(false);
  const [description, setDescription] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setSelectedImageURL(imageUrl);
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
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameError,
    valueChangedHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    resetFunction: resetNameFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredSurname,
    isValid: enteredSurnameIsValid,
    hasError: surnameError,
    valueChangedHandler: surnameChangeHandler,
    inputBlurHandler: surnameBlurHandler,
    resetFunction: resetSurnameFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailError,
    valueChangedHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetFunction: resetEmailFunction,
  } = useInput((value) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  );

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordError,
    valueChangedHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetFunction: resetPasswordFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: confirmPassword,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordError,
    valueChangedHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    resetFunction: resetConfirmPasswordFunction,
  } = useInput((value) => value.trim() === enteredPassword);

  //org inputs

  //nameOrg
  const {
    value: enteredNameOrg,
    isValid: enteredNameOrgIsValid,
    hasError: nameOrgError,
    valueChangedHandler: nameOrgChangeHandler,
    inputBlurHandler: nameOrgBlurHandler,
    resetFunction: resetNameOrgFunction,
  } = useInput((value) => value.trim() !== "");

  //1
  const {
    value: enteredFBOrg,
    valueChangedHandler: FBChangeHandler,
    resetFunction: resetFBFunction,
  } = useInput((value) => value.trim() !== "");

  //2
  const {
    value: twitterOrg,
    valueChangedHandler: twitterChangeHandler,
    resetFunction: resetTwitterFunction,
  } = useInput((value) => value.trim() !== "");
  //3
  const {
    value: instagramOrg,
    valueChangedHandler: instagramOrgChangeHandler,
    resetFunction: resetInstagramFunction,
  } = useInput((value) => value.trim() !== "");
  //4
  const {
    value: youtubeOrg,
    valueChangedHandler: youtubeOrgChangeHandler,
    resetFunction: resetYoutubeFunction,
  } = useInput((value) => value.trim() !== "");
  //5
  const {
    value: linkedinOrg,
    valueChangedHandler: linkedinOrgChangeHandler,
    resetFunction: resetLinkedinFunction,
  } = useInput((value) => value.trim() !== "");
  //6
  const {
    value: websiteUrl,
    valueChangedHandler: websiteUrlOrgChangeHandler,
    resetFunction: resetWebsiteUrlFunction,
  } = useInput((value) => value.trim() !== "");

  const resetDescriptionFunction = () => {
    setDescription("");
  };
  const resetImageField = () => {
    setSelectedImage(null);
    setImages([]);
    setSelectedImageURL(null);
  };
  const handleCheckboxChange = (event) => {
    setIsOrganisator(event.target.checked);
  };

  const handleDescriptionOnChange = (event) => {
    setDescription(event.target.value);
  };

  let registrationNotValid = true;
  if (
    enteredNameIsValid &&
    enteredSurnameIsValid &&
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    confirmPasswordIsValid
  ) {
    if (isOrganisator) {
      if (enteredNameOrgIsValid && images.length!==0) {
        registrationNotValid = false;
      } else registrationNotValid = true;
    } else {
      registrationNotValid = false;
    }
  } else {
    registrationNotValid = true;
  }

  const registerSubmitHandler = async (event) => {
    event.preventDefault();
    if (
      !enteredNameIsValid ||
      !enteredSurnameIsValid ||
      !enteredEmailIsValid ||
      !enteredPasswordIsValid ||
      !confirmPasswordIsValid 
    ) {
      if (isOrganisator) {
        
        if (!enteredNameOrgIsValid || images.length===0 ) {
          return;
        }
      }
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageRequest", image);
    });
    const imgResponse = await axios.post(
      `${process.env.REACT_APP_IMAGE_URL}/Image/onlyfiles`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    

    let payload = {
      firstName: enteredName,
      lastName: enteredSurname,
      email: enteredEmail,
      password: enteredPassword,
    };
    if (isOrganisator) {
      payload.organization = {
        name: enteredNameOrg,
        description: description,
        logoUrl: imgResponse.data[0],
        websiteUrl: websiteUrl,
        facebookUrl: enteredFBOrg,
        instagramUrl: instagramOrg,
        twitterUrl: twitterOrg,
        youtubeUrl: youtubeOrg,
        linkedInUrl: linkedinOrg,
      };
    }

    await register(payload);

    resetNameFunction();
    resetEmailFunction();
    resetSurnameFunction();
    resetConfirmPasswordFunction();
    resetPasswordFunction();

    resetNameOrgFunction();
    resetDescriptionFunction();
    resetImageField();
    resetWebsiteUrlFunction();
    resetFBFunction();
    resetInstagramFunction();
    resetTwitterFunction();
    resetLinkedinFunction();
    resetYoutubeFunction();
  };
  return (
    <form className={classes["register-form"]} onSubmit={registerSubmitHandler}>
      <div className={classes["left-register-container"]}>
        <Introduction />
      </div>

      <div className={classes["right-register-container"]}>
        <div className={classes["register-handler"]}>
          <h1 className={classes["main-sign"]}>Sign up</h1>

          <p className={classes["already-have-account"]}>
            Već imate nalog?{" "}
            <Link to="/login" className={classes["register-links"]}>
              Login
            </Link>
          </p>

          <Input
            label={"Ime"}
            type="text"
            id="registerName"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            isNotValid={nameError}
            isRequeired={true}
          ></Input>
          {nameError && (
            <label className={classes["error-text"]}>Name required!</label>
          )}

          <Input
            label={"Prezime"}
            type="text"
            id="registerSurname"
            value={enteredSurname}
            onChange={surnameChangeHandler}
            onBlur={surnameBlurHandler}
            isNotValid={surnameError}
            isRequeired={true}
          ></Input>
          {surnameError && (
            <label className={classes["error-text"]}>Surname required!</label>
          )}

          <Input
            label={"E-mail"}
            type="email"
            id="registerEmail"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            isNotValid={emailError}
            isRequeired={true}
          ></Input>
          {emailError && (
            <label className={classes["error-text"]}>
              Invalid email address!
            </label>
          )}

          <Input
            label={"Lozinka"}
            type="password"
            id="registerPassword"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            isNotValid={passwordError}
            isRequeired={true}
          ></Input>
          {passwordError && (
            <label className={classes["error-text"]}>
              Please enter a valid password!
            </label>
          )}

          <Input
            label={"Potvrdi lozinku"}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            isNotValid={confirmPasswordError}
            isRequeired={true}
          ></Input>
          {confirmPasswordError && (
            <label className={classes["error-text"]}>
              Lozinke se ne poklapaju!
            </label>
          )}

          <div className={classes["choose-org"]}>
            <input
              className={classes["org-check"]}
              type={"checkbox"}
              onChange={handleCheckboxChange}
            ></input>
            <label id={"description-textarea"} className={classes["org-label"]}>
              Prijavi se kao organizator
            </label>
          </div>

          {isOrganisator && (
            <div>
              <Input
                label={"Ime organizacije"}
                type="text"
                id="registerNameOrg"
                value={enteredNameOrg}
                onChange={nameOrgChangeHandler}
                onBlur={nameOrgBlurHandler}
                isNotValid={nameOrgError}
                isRequeired={true}
              ></Input>
              {nameOrgError && (
                <label className={classes["error-text"]}>
                  Potrebno je ime organizacije!
                </label>
              )}

              <div className={classes["desc-div"]}>
                <label>Opis</label>
                <textarea
                  onChange={handleDescriptionOnChange}
                  className={classes["description-area"]}
                />
              </div>

              <div className={classes["upload-div"]}>
                <p className={classes["upload-logo"]}>Postavite logo</p>

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
              ></Input>

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
            </div>
          )}

          <div className={classes["register-button-div"]}>
            <Button
              type={"submit"}
              className={classes["register-button"]}
              disabled={registrationNotValid}
            >
              Napravi nalog
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterInput;
