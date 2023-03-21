import useInput from "../../hooks/use-input";
import classes from "./LoginInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";


import axios from "../../api/axios";
import {useState, useContext} from "react";
import AuthContext from "../../store/AuthContext";

import { Link } from "react-router-dom";

const LOGIN_URL = '/authenticate';
const LoginInput = () => {
    
    const [errMessage, setErrorMessage] = useState('');
    const {login} = useContext(AuthContext);
    
    const {
        value: enteredName,
        isValid: enteredNameIsValid,
        hasError: nameInputHasError,
        valueChangedHandler: nameChangedHandler,
        inputBlurHandler: nameBlurHandler,
        resetFunction: resetNameFunction,
    } = useInput((value) => value.trim() !== '');

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputError,
    valueChangedHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    resetFunction: resetEmailNameFunction,
  } = useInput((value) => value.includes("@"));

  let formIsValid = false;
  if (enteredNameIsValid && enteredEmailIsValid) {
    //moze da se doda jos opcija koje se proveravaju
    // setFormIsValid(true);
    formIsValid = true;
  } else {
    // setFormIsValid(false);
    formIsValid = false;
  }

    const formSubmissionHandler = async (event) => {
        event.preventDefault();
        if (!enteredNameIsValid || !enteredEmailIsValid) {
            return;
        }
        let payload = {
            email:enteredEmail,
            password:enteredName
        }
        await login(payload);

        console.log(enteredName);
        console.log(enteredEmail);

    resetNameFunction();
    resetEmailNameFunction();
  };

    /*const nameInputClasses = nameInputHasError
      ? classes["form-control invalid"]
      : classes["form-control"];
    const emailInputClasses = emailInputError
      ? classes["form-control invalid"]
      : classes["form-control"];*/
  return (
    <form className={classes["login-form"]} onSubmit={formSubmissionHandler}>
      <div className={classes["right-login-container"]}></div>
      <div className={classes["left-login-container"]}>
        <div className={classes["login-handler"]}>
          <div className={classes["icon"]}></div>
          <h1>Login</h1>
          <p className={classes["dont-have-account"]}>
            Don't have an account?{" "}
            <Link to="/register" className={classes["login-links"]}>
              Create an account
            </Link>
          </p>
          {/*<div
            className={`${classes["form-control"]} ${
              emailInputError ? classes.invalid : ""
            }`}
          >
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={enteredEmail}
              onChange={emailChangedHandler}
              onBlur={emailBlurHandler}
            />
            {emailInputError && (
              <label className={classes["error-text"]}>
                Email Must not be empty!
              </label>
            )}
          </div>*/}
          <Input
            label={"E-mail"}
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangedHandler}
            onBlur={emailBlurHandler}
            isNotValid={emailInputError}
          ></Input>
          {emailInputError && (
            <label className={classes["error-text"]}>
              Invalid email address!
            </label>
          )}

                    {/*<div
            className={`${classes["form-control"]} ${
              nameInputHasError ? classes.invalid : ""
            }`}
          >
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={enteredName}
              onChange={nameChangedHandler}
              onBlur={nameBlurHandler}
            />
            {enteredName.length === 0 && (
              <label className={classes["error-text"]}>
                Password Must not be empty!
              </label>
            )}
          </div>*/}
          <Input
            label={"Password"}
            type="password"
            id="password"
            value={enteredName}
            onChange={nameChangedHandler}
            onBlur={nameBlurHandler}
            isNotValid={nameInputHasError}
          ></Input>
          {nameInputHasError && (
            <label className={classes["error-text"]}>
              Password must be at least 8 characters!
            </label>
          )}
          <div>
            <label>
              <a href="" className={classes["login-links"]}>
                Forgot your password?
              </a>
            </label>
          </div>
          <div className={classes["form-actions"]}>
            <Button
              type={"submit"}
              className={classes["login-button"]}
              disabled={!formIsValid}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginInput;
