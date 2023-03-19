import React, { useContext, useState } from "react";
import { Button } from "./NavButton";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Dropdown from "./Dropdown";
import AuthContext from "../../store/AuthContext";

function Navbar() {
  const { user , logout} = useContext(AuthContext);
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <i className="fa-regular fa-calendar-plus"></i>
          MANIFESTACIJE
          {/*<i class="fab fa-firstdraft" />*/}
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li
            className="nav-item"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Link
              to="/services"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Padanje <i className="fas fa-caret-down" />
            </Link>
            {dropdown && <Dropdown />}
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
              About
            </Link>
          </li>

          {user && (
            <li className="nav-item">
              <Link to="/user" className="nav-links" onClick={closeMobileMenu}>
                Profile
              </Link>
            </li>
          )}

          {!user && <li>
            <Link
              to="/login"
              className="nav-links-mobile"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>}
          {user && <li>
            <Link
                to="/login"
                className="nav-links-mobile"
                onClick={ () => { logout() }}
            >
              Logout
            </Link>
          </li>}
        </ul>
        {!user && <Button className={"nav-button"} title={"Login"}/>}
        {user && <Button  onClick={logout} className={"nav-button"} title={"logout"}/>}
      </nav>
    </>
  );
}

export default Navbar;
