import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import classes from "./ChangePassword.module.css";
import Button from "../UI/Button/Button";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
const ChangePassword = (props) => {
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

  let resetNotValid;
  resetNotValid = !(enteredPasswordIsValid && confirmPasswordIsValid);
  const resetSubmitHandler = async (event) => {
    event.preventDefault();
    if (!enteredPasswordIsValid || !confirmPasswordIsValid) {
      return;
    }
    const payload = {
      password: enteredPassword,
    };
    await checkTokenAndRefresh();
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/users/${props.id}`,
      payload,
      { headers: header }
    );
    props.setUser(response.data);
    resetConfirmPasswordFunction();
    resetPasswordFunction();
  };
  return (
    <form onSubmit={resetSubmitHandler}>
      <p className={classes["main-text"]}>Izmeni lozinku</p>

      <Input
        label={"Lozinka"}
        type="password"
        id="resetPassword"
        value={enteredPassword}
        onChange={passwordChangeHandler}
        onBlur={passwordBlurHandler}
        isNotValid={passwordError}
        className={classes["input-form"]}
      ></Input>
      {passwordError && (
        <label className={classes["error-text"]}>
          Uneta lozinka nije validna!
        </label>
      )}
      <Input
        label={"Potvrdite lozinku"}
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={confirmPasswordChangeHandler}
        onBlur={confirmPasswordBlurHandler}
        isNotValid={confirmPasswordError}
        className={classes["input-form"]}
      ></Input>
      {confirmPasswordError && (
        <label className={classes["error-text"]}>
          Lozinke se ne poklapaju!
        </label>
      )}

      <Button
        type={"submit"}
        className={classes["login-button"]}
        disabled={resetNotValid}
      >
        Izmeni lozinku
      </Button>
    </form>
  );
};
export default ChangePassword;
