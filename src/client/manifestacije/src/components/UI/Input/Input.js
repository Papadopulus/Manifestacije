import classes from "./Input.module.css";

const Input = (props) => {
    const labelStyle = {
        color: props.firstLabelColor ? props.firstLabelColor : 'initial',
    };
    return (
        <div
            className={`${classes.control} ${
                props.isNotValid === true ? classes.invalid : ""
            }`}
        >
            <label htmlFor={props.id} style={labelStyle}> 
                
                {props.label} {props.isRequeired && (<sup className={classes["required"]}>*</sup>)}
            </label>
            
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
