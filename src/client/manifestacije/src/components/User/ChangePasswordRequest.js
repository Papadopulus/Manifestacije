import React from "react";
import classes from "./ChangePasswordRequest.module.css";
import Button from "../UI/Button/Button";
import axios from "axios";

function ChangePasswordRequest(props) {
  const resetSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await axios.get(`${process.env.REACT_APP_BASE_URL}/reset-password/${props.email}`);
    } catch (error) {
      console.error("Error retrieving the e-mail:", error);
    }
  };
  return (
    <form onSubmit={resetSubmitHandler}>
      <p className={classes["main-text"]}>Izmeni lozinku</p>
      <p className={classes["have-account"]}>
          Molimo vas pritisnite na dugme i poslacemo vam link za resetovanje
          vase lozinke na vasu e-mail adresu
      </p>

      <Button type={"submit"} className={classes["login-button"]}>
        Posalji kod za reset
      </Button>
    </form>
  );
}

export default ChangePasswordRequest;
