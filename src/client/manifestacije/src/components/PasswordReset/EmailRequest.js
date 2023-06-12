import React from "react";
import classes from "./EmailRequest.module.css";
import Introduction from "../Introduction/Introduction";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import useInput from "../../hooks/use-input";
import axios from "axios";

function EmailRequest() {
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
  if (enteredEmailIsValid) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    if (!enteredEmailIsValid) {
      return;
    }
    resetEmailNameFunction();
    try {
      await axios.get(`https://localhost:7237/reset-password/${enteredEmail}`);
    } catch (error) {
      console.error("Error retrieving the e-mail:", error);
    }
  };

  return (
    <form className={classes["reset-form"]} onSubmit={formSubmissionHandler}>
      <div className={classes["left-reset-container"]}>
        <Introduction />
      </div>
      <div className={classes["right-reset-container"]}>
        <div className={classes["reset-handler"]}>
          <h1>Resetuj Lozinku</h1>
          <p className={classes["have-account"]}>
            Molimo Vas unesite e-mail adresu i mi ćemo vam poslati link za
            resetovanje lozinke!
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

          <div className={classes["form-actions"]}>
            <Button
              type={"submit"}
              className={classes["reset-button"]}
              disabled={!formIsValid}
            >
              Pošalji kod za resetovanje lozinke
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EmailRequest;
