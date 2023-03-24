import useInput from "../../hooks/use-input";
import classes from "./LoginInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import {useContext} from "react";
import AuthContext from "../../store/AuthContext";

import {Link} from "react-router-dom";

const LoginInput = () => {

    // const [errMessage, setErrorMessage] = useState('');
    const {login} = useContext(AuthContext);
    const {errorMessageLogin} = useContext(AuthContext);
    
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
        formIsValid = true;
    } else {
        formIsValid = false;
    }

    const formSubmissionHandler = async (event) => {
        event.preventDefault();
        if (!enteredNameIsValid || !enteredEmailIsValid) {
            return;
        }
        let payload = {
            email: enteredEmail,
            password: enteredName
        }
        await login(payload);
        
        console.log(enteredName);
        console.log(enteredEmail);

        resetNameFunction();
        resetEmailNameFunction();
    };
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
                        {errorMessageLogin && (
                            <label className={classes["error-text"]}>
                                {errorMessageLogin}
                            </label>)
                        }
                    </div>
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
                            disabled={!formIsValid}>
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default LoginInput;
