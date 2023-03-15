import useInput from "../../hooks/use-input";
import classes from "./LoginInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";


import axios from "../../api/axios";
import {useState} from "react";

const LOGIN_URL = '/authenticate';
const LoginInput = () => {
  const [errMessage,setErrorMessage] = useState('');
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

    const formSubmissionHandler = async (event) =>  {
        event.preventDefault();
        if (!enteredNameIsValid || !enteredEmailIsValid) {
            return;
        }
        
        try {
          const response = await axios.post(LOGIN_URL,
              JSON.stringify({email:enteredEmail,password:enteredName}),
              {
                headers:{ 'Content-Type': 'application/json'},
                // withCredentials:true
              })
          console.log(response);
        }
        catch (err){
          if(!err?.response){
            setErrorMessage('No Server Response');
          }
          else if (err.response?.status === 400){
            setErrorMessage('Missing Email or password')
          }else if (err.response?.status === 401){
            setErrorMessage('Unauthorized');
          }else{
            setErrorMessage('Login failed');
          }
          console.log(errMessage);
        }
        
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
            <div className={classes["right-login-container"]}>
                
            </div>
            <div className={classes["left-login-container"]}>
                <div className={classes["login-handler"]}>
                    <div className={classes["icon"]}></div>
                    <h1>Login</h1>
                    <p>
                        Don't have an account? <a href="">Create an account</a>
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
                            <a href="">Forgot your password?</a>
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
