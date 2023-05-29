import React from "react";
import classes from "./NotLoggedIn.module.css";
import { useNavigate } from "react-router-dom";

function NotLoggedIn(props) {
  const navigate = useNavigate();

  function cancelHandle() {
    props.cancel(false);
  }

  return (
    <>
      <div className={classes["custom-dialog-overlay"]} />
      <div className={classes["custom-dialog-box"]}>
        <p>
          Molim vas da se prijavite kako bi ste koristili ovu funkcionalnost!
        </p>
        <div className={classes["buttons"]}>
          <button onClick={cancelHandle} className={classes.button}>
            Cancel
          </button>
          <button onClick={() => navigate("/login")} className={classes.button}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

export default NotLoggedIn;
