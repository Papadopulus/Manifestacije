import classes from "./RegisterInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import {Link} from "react-router-dom";
import useInput from "../../hooks/use-input";

const RegisterInput = () => {

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


    let registrationNotValid = true;
    if (enteredNameIsValid &&
        enteredSurnameIsValid &&
        enteredEmailIsValid &&
        enteredPasswordIsValid &&
        confirmPasswordIsValid) {
        registrationNotValid = false;
    } else {
        registrationNotValid = true;
    }

    const registerSubmitHandler=/*async*/(event)=>{
        event.preventDefault();
        if(!enteredNameIsValid ||
            !enteredSurnameIsValid ||
            !enteredEmailIsValid ||
            !enteredPasswordIsValid ||
            !confirmPasswordIsValid)
        {
            return;
        }
        else
        {
            //payload
            //await metoda
            resetNameFunction();
            resetEmailFunction();
            resetSurnameFunction();
            resetConfirmPasswordFunction();
            resetPasswordFunction();
        }

    }
  return (
    <form className={classes["register-form"]} onSubmit={registerSubmitHandler}>
      <div className={classes["left-register-container"]}>
        <h1>Levi</h1>
      </div>

      <div className={classes["right-register-container"]}>
          <div className={classes["register-handler"]}>
              <div className={classes["icon"]}></div>
              <h1>Sign up</h1>
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
