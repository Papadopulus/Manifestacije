import useInput from "../../hooks/use-input";
import classes from "./LoginInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import Introduction from "../Introduction/Introduction";

import { Link } from "react-router-dom";

const LoginInput = () => {
  // const [errMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const { errorMessageLogin } = useContext(AuthContext);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangedHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    resetFunction: resetNameFunction,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputError,
    valueChangedHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    resetFunction: resetEmailNameFunction,
  } = useInput((value) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  );

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
      password: enteredName,
    };
    await login(payload);

    console.log(enteredName);
    console.log(enteredEmail);

    resetNameFunction();
    resetEmailNameFunction();
  };
  return (
    <form className={classes["login-form"]} onSubmit={formSubmissionHandler}>
      <div className={classes["left-login-container"]}>
        <Introduction />
      </div>
      <div className={classes["right-login-container"]}>
        <div className={classes["login-handler"]}>
          <h1>Prijavi se</h1>
          <p className={classes["dont-have-account"]}>
            Nemate nalog?{" "}
            <Link to="/register" className={classes["login-links"]}>
              Napravi nalog
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
              Uneta e-mail adresa nije validna!
            </label>
          )}
          <Input
            label={"Lozinka"}
            type="password"
            id="password"
            value={enteredName}
            onChange={nameChangedHandler}
            onBlur={nameBlurHandler}
            isNotValid={nameInputHasError}
          ></Input>
          {nameInputHasError && (
            <label className={classes["error-text"]}>
              Uneta lozinka nije validna!
            </label>
          )}
          <div>
            {errorMessageLogin && (
              <label className={classes["error-text"]}>
                {errorMessageLogin}
              </label>
            )}
          </div>
          <div>
            <label>
              <Link to="/resetRequest" className={classes["login-links"]}>
                Zaboravili ste lozinku?
              </Link>
            </label>
          </div>
          <div className={classes["form-actions"]}>
            <Button
              type={"submit"}
              className={classes["login-button"]}
              disabled={!formIsValid}
            >
              Prijavi se
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginInput;
