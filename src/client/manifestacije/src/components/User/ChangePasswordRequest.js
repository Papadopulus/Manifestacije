import React from "react";
import classes from "./ChangePasswordRequest.module.css";
import Button from "../UI/Button/Button";
import axios from "axios";

function ChangePasswordRequest(props) {
  const resetSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await axios.get(`https://localhost:7237/reset-password/${props.email}`);
    } catch (error) {
      console.error("Error retrieving the e-mail:", error);
    }
  };
  return (
    <form onSubmit={resetSubmitHandler}>
      <p className={classes["main-text"]}>Izmeni lozinku</p>
      <p className={classes["have-account"]}>
        Please press the button and we will send you a link to reset your
        password on your e-mail!
      </p>

      <Button type={"submit"} className={classes["login-button"]}>
        Send Reset Code
      </Button>
    </form>
  );
}

export default ChangePasswordRequest;
