import React from "react";
import "./NavButton.css";
import { Link } from "react-router-dom";

export function Button(props) {
  return (
    <Link to="/login">
      <button className={`${"btn"} ${props.className}`}>Login</button>
    </Link>
  );
}
