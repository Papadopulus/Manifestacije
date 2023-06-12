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
        Molim Vas pritisnite dugme i mi ćemo vam poslati link za resetovanje
        lozinke na Vašu e-mail adresu!
      </p>

      <Button type={"submit"} className={classes["login-button"]}>
        Pošalji kod za resetovanje lozinke
      </Button>
    </form>
  );
}

export default ChangePasswordRequest;
