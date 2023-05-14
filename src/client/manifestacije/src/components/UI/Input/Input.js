import classes from "./Input.module.css";

const Input = (props) => {
    console.log(props.isRequeired);
    return (
        <div
            className={`${classes.control} ${
                props.isNotValid === true ? classes.invalid : ""
            }`}
        >
            <label htmlFor={props.id}>{props.isRequeired && (<span className={classes["required"]}>*</span>)} {props.label} {props.isRequeired && (<sup className={classes["required"]}>  required</sup>)}</label>
            
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
