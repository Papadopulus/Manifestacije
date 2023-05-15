﻿import classes from "./Input.module.css";

const Input = (props) => {
    return (
        <div
            className={`${classes.control} ${
                props.isNotValid === true ? classes.invalid : ""
            }`}
        >
            <label htmlFor={props.id}> {props.label} {props.isRequeired && (<sup className={classes["required"]}>*</sup>)}</label>
            
            <input
                type={props.type}
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
        </div>
    );
};

export default Input;
