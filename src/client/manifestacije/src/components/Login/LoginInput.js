import useInput from "../../hooks/use-input";
import classes from "./LoginInput.module.css";
import CardLook from "../UI/CardLook/CardLook";
import Button from "../UI/Button/Button";
const LoginInput = () => {
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

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    if (!enteredNameIsValid || !enteredEmailIsValid) {
      return;
    }
    console.log(enteredName);
    console.log(enteredEmail);

    resetNameFunction();
    resetEmailNameFunction();
  };

  const nameInputClasses = nameInputHasError
    ? classes["form-control invalid"]
    : classes["form-control"];
  const emailInputClasses = emailInputError
    ? classes["form-control invalid"]
    : classes["form-control"];
  return (
    <CardLook className={classes["input-look"]}>
      <form className={classes["login-form"]} onSubmit={formSubmissionHandler}>
        <div className={classes["left-login-container"]}>
          <div className={classes["login-label"]}>
            <label>Login</label>
            <p>
              Don't have an account?<a href="">Create an account</a>
            </p>
          </div>
          <div
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
          </div>
          <div
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
            {nameInputHasError && (
              <label className={classes["error-text"]}>
                Password Must not be empty!
              </label>
            )}
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
        <div className={classes["right-login-container"]}></div>
      </form>
    </CardLook>
  );
};

export default LoginInput;
