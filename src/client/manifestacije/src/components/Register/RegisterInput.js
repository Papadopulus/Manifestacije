import classes from "./RegisterInput.module.css.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";

import {useState} from "react";

//axiois i hooks naknadno

const registerFormHandler=()=>{

}
const RegisterInput =()=>{

    return (
        <form className={classes["register-form"]} onSubmit={registerFormHandler}>
            <div className={classes["left-register-container"]}>
                <h1>Levi</h1>
            </div>

            <div className={classes["right-register-container"]}>

            </div>
        </form>

    );
};

export default RegisterInput;

