import classes from "./CardLook.module.css";

const CardLook = (props) => {
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default CardLook;
