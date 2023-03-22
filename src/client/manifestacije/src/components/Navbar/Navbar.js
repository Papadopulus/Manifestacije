import React, {useContext, useEffect, useState} from "react";
import { Button } from "./NavButton";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Dropdown from "./Dropdown";
import AuthContext from "../../store/AuthContext";

function Navbar() {
  const { user , logout} = useContext(AuthContext);
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 960);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
  const homeIcon = isMobile ? (
      <i className="fas fa-home" />
  ) : (
      <>
        <i className="fa-regular fa-calendar-plus"></i>
        MANIFESTACIJE
      </>
  );

  const aboutIcon = isMobile ? (
      <i className="fas fa-scroll"></i>
  ) : (
      "About"
  );
  
  const profileIcon= isMobile ? (
      <i className="fas fa-user-circle"></i>
  ) : (
      "Profile"
  );
  const logoutIcon=isMobile ? (
      <i className="fa-solid fa-right-from-bracket"></i>
  ) : (
      "Logout"
  );

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          {homeIcon}
          {/*<i class="fab fa-firstdraft" />*/}
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
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

          

          {!user && <li>
            <Link
              to="/login"
              className="nav-links-mobile"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>}
          {!user && <li>
            <Link
                to="/register"
                className="nav-links-mobile-register"
                onClick={closeMobileMenu}
            >
              Sign Up
            </Link>
          </li>}
          
        </ul>
        {user && (
            <li className="nav-item-outside">
              <Link to="/user" className="nav-links-outside" onClick={closeMobileMenu}>
                {profileIcon}
              </Link>
            </li>
        )}
        {user && <li className="nav-item-outside">
          <Link
              to="/login"
              className="nav-links-outside"
              onClick={ () => { logout() }}
          >
            {logoutIcon}
          </Link>
       
        </li>}
        <li className="nav-item-outside">
          <Link to="/about" className="nav-links-outside" onClick={closeMobileMenu}>
            {aboutIcon}
          </Link>
        </li>
        {!user && <Button className={"nav-button"} to={"/login"} title={"Login"}/>}
        {!user && <Button className={"nav-register-button"} to={"/register"} title={"Sign Up"}/>}
        {user && <Button  onClick={logout} className={"nav-button"} title={"Logout"}/>}
      </nav>
    </>
  );
}

export default Navbar;
