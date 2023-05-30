import classes from "./PasswordReset.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Introduction from "../Introduction/Introduction";
const PasswordReset = () => {
  const { token } = useParams();
  const decodedToken = decodeURIComponent(token);
  const navigate = useNavigate();

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
    try {
      const payload = {
        token: decodedToken,
        password: enteredPassword,
      };
      await axios.post(`https://localhost:7237/reset-password`, payload);
    } catch (error) {
      console.error("Error performing reset password:", error);
    }
    resetConfirmPasswordFunction();
    resetPasswordFunction();
    navigate("/login");
  };
  return (
    <form className={classes["reset-form"]} onSubmit={resetSubmitHandler}>
      <div className={classes["left-reset-container"]}>
        <Introduction />
      </div>
      <div className={classes["right-reset-container"]}>
        <div className={classes["reset-handler"]}>
          <h1 className={classes["main-sign"]}>Unesite novu lozinku</h1>

          <Input
            label={"Lozinka"}
            type="password"
            id="resetPassword"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            isNotValid={passwordError}
          ></Input>
          {passwordError && (
            <label className={classes["error-text"]}>
              Lozinka nije validna!
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
          ></Input>
          {confirmPasswordError && (
            <label className={classes["error-text"]}>
              Lozinke se ne poklapaju!
            </label>
          )}
          <div className={classes["reset-button-div"]}>
            <Button
              type={"submit"}
              className={classes["reset-button"]}
              disabled={resetNotValid}
            >
              Izmeni lozinku
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default PasswordReset;
