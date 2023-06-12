import React, { useContext, useEffect, useState } from "react";
import { Button } from "./NavButton";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Dropdown from "./Dropdown";
import AuthContext from "../../store/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
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
    <>
      <i className="fas fa-home"></i>
      <p className={"navbar-par"}>Početna</p>
    </>
  ) : (
    <>
      {/*<i className="fa-regular fa-calendar-plus"></i>*/}
      <p className={"navbar-text-logo"}>manifestacije</p>
    </>
  );

  const aboutIcon = isMobile ? (
    <>
      <i className="fas fa-scroll"></i>
      <p className={"navbar-par"}>O nama</p>
    </>
  ) : (
    "O nama"
  );

  const profileIcon = isMobile ? (
    <>
      <i className="fas fa-user-circle"></i>
      <p className={"navbar-par"}>Profil</p>
    </>
  ) : (
    "Profil"
  );
  const organisationIcon = "Dodaj";
  const logoutIcon = isMobile ? (
    <>
      <i className="fa-solid fa-right-from-bracket"></i>
      <p className={"navbar-par"}>Odjavi se</p>
    </>
  ) : (
    "Odjavi se"
  );

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          {homeIcon}
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
            <p className={"navbar-par"}>Još</p>
          </>
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li
            className="nav-item"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {isMobile && user && user.Roles === "Organization" && (
              <Link
                to="/organisation/event"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Dodaj <i className="fas fa-caret-down" />
              </Link>
            )}
            {dropdown && <Dropdown />}
          </li>

          {!user && (
            <li>
              <Link
                to="/login"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Prijavi se
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link
                to="/register"
                className="nav-links-mobile-register"
                onClick={closeMobileMenu}
              >
                Napravi nalog
              </Link>
            </li>
          )}
        </ul>
        {user && (
          <Link
            to="/user"
            className="nav-links-outside"
            onClick={closeMobileMenu}
          >
            {profileIcon}
          </Link>
        )}

        {user && user.Roles === "Organization" && !isMobile && (
          <Link
            to="/organisation/event"
            className="nav-links-outside"
            onClick={closeMobileMenu}
          >
            {organisationIcon}
          </Link>
        )}
        <Link
          to="/about"
          className="nav-links-outside"
          onClick={closeMobileMenu}
        >
          {aboutIcon}
        </Link>
        {!user && !isMobile && (
          <Button className={"nav-login-button"} to={"/login"}>
            Prijavi se
          </Button>
        )}
        {!user && !isMobile && (
          <Button className={"nav-register-button"} to={"/register"}>
            Napravi nalog
          </Button>
        )}
        {isMobile
          ? user && (
              <Link
                to="/login"
                className="nav-links-outside"
                onClick={() => {
                  logout();
                }}
              >
                {logoutIcon}
              </Link>
            )
          : user && (
              <Button onClick={logout} to={"/login"} className={"nav-button"}>
                Odjavi se
              </Button>
            )}
      </nav>
    </div>
  );
}

export default Navbar;
