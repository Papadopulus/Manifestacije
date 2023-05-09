import classes from "./RegisterInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import {Link} from "react-router-dom";
import useInput from "../../hooks/use-input";
import {useState, useContext} from "react";
import AuthContext from "../../store/AuthContext";
import Introduction from "../Introduction/Introduction";

const RegisterInput = () => {
    const {register} = useContext(AuthContext);
    const [isOrganisator, setIsOrganisator] = useState(false);

    const {
        value: enteredName,
        isValid: enteredNameIsValid,
        hasError: nameError,
        valueChangedHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        resetFunction: resetNameFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: enteredSurname,
        isValid: enteredSurnameIsValid,
        hasError: surnameError,
        valueChangedHandler: surnameChangeHandler,
        inputBlurHandler: surnameBlurHandler,
        resetFunction: resetSurnameFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: enteredEmail,
        isValid: enteredEmailIsValid,
        hasError: emailError,
        valueChangedHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        resetFunction: resetEmailFunction,
    } = useInput((value) => value.includes("@"));

    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passwordError,
        valueChangedHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        resetFunction: resetPasswordFunction,
    } = useInput((value) => value.trim() !== '');

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
    } = useInput((value) => value.trim() !== '');

    //1
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
    const handleCheckboxChange = (event) => {
        setIsOrganisator(event.target.checked);
    }

    let registrationNotValid = true;
    if (enteredNameIsValid &&
        enteredSurnameIsValid &&
        enteredEmailIsValid &&
        enteredPasswordIsValid &&
        confirmPasswordIsValid) {
        if (isOrganisator) {
            if (enteredNameOrgIsValid) {
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
        if (!enteredNameIsValid ||
            !enteredSurnameIsValid ||
            !enteredEmailIsValid ||
            !enteredPasswordIsValid ||
            !confirmPasswordIsValid ||
            !enteredNameOrgIsValid) {
            return;
        }

        let payload = {
            firstName: enteredName,
            lastName: enteredSurname,
            email: enteredEmail,
            password: enteredPassword,
        }
        if (isOrganisator) {
            payload.organization = {
                name: enteredNameOrg,
                logoUrl: logoUrl,
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
        resetFBFunction();
        resetTwitterFunction();
        resetInstagramFunction();
        resetWebsiteUrlFunction();
        resetLogoUrlFunction();
        resetLinkedinFunction();
        resetYoutubeFunction();
    }
    return (
        <form className={classes["register-form"]} onSubmit={registerSubmitHandler}>
            <div className={classes["left-register-container"]}>
                <Introduction/>
            </div>

            <div className={classes["right-register-container"]}>
                <div className={classes["register-handler"]}>
                    <h1 className={classes["main-sign"]}>Sign up</h1>

                    <p className={classes["already-have-account"]}>Already have an account? {" "}
                        <Link to="/login" className={classes["register-links"]}>Login</Link>
                    </p>

                    <Input
                        label={"Name"}
                        type="text"
                        id="registerName"
                        value={enteredName}
                        onChange={nameChangeHandler}
                        onBlur={nameBlurHandler}
                        isNotValid={nameError}
                    ></Input>
                    {nameError && (
                        <label className={classes["error-text"]}>
                            Name required!
                        </label>
                    )}


                    <Input
                        label={"Surname"}
                        type="text"
                        id="registerSurname"
                        value={enteredSurname}
                        onChange={surnameChangeHandler}
                        onBlur={surnameBlurHandler}
                        isNotValid={surnameError}
                    ></Input>
                    {surnameError && (
                        <label className={classes["error-text"]}>
                            Surname required!
                        </label>
                    )}

                    <Input
                        label={"E-mail"}
                        type="email"
                        id="registerEmail"
                        value={enteredEmail}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        isNotValid={emailError}
                    ></Input>
                    {emailError && (
                        <label className={classes["error-text"]}>
                            Invalid email address!
                        </label>
                    )}

                    <Input
                        label={"Password"}
                        type="password"
                        id="registerPassword"
                        value={enteredPassword}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        isNotValid={passwordError}
                    ></Input>
                    {passwordError && (
                        <label className={classes["error-text"]}>
                            Please enter a valid password!
                        </label>
                    )}

                    <Input
                        label={"Confirm password"}
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={confirmPasswordBlurHandler}
                        isNotValid={confirmPasswordError}
                    ></Input>
                    {confirmPasswordError && (
                        <label className={classes["error-text"]}>
                            The passwords don't match!
                        </label>
                    )}
                    
                    <div className={classes["choose-org"]}>
                        
                        <input  className={classes["org-check"]} type={"checkbox"} onChange={handleCheckboxChange}></input>
                        <label className={classes["org-label"]}>Sign up as Organisator</label>
                    </div>
                    
                    {isOrganisator && (
                        <div>
                            <Input
                                label={"Organisation name"}
                                type="text"
                                id="registerNameOrg"
                                value={enteredNameOrg}
                                onChange={nameOrgChangeHandler}
                                onBlur={nameOrgBlurHandler}
                                isNotValid={nameOrgError}>
                            </Input>
                            {nameOrgError && (
                                <label className={classes["error-text"]}>
                                    Name of the Organisation is required!
                                </label>
                            )}

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

                        </div>
                    )}

                    <div className={classes["register-button-div"]}>
                        <Button
                            type={"submit"}
                            className={classes["register-button"]}
                            disabled={registrationNotValid}>
                            Create an account</Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default RegisterInput;
