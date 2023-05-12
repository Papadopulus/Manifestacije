import React from "react";
import "./NavButton.css";
import { Link } from "react-router-dom";

export function Button(props) {
  return (
    <Link to={props.to}>
      <button onClick={props.onClick} className={`${"btn"} ${props.className}`}>
        {props.children}
      </button>
    </Link>
  );
}
