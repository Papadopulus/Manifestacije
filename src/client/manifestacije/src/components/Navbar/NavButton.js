import React from "react";
import "./NavButton.css";
import { Link } from "react-router-dom";

export function Button(props) {
  return (
    <Link to="/login">
      <button onClick={props.onClick} className={`${"btn"} ${props.className}`}>{props.title}</button>
    </Link>
  );
}
