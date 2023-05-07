import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import AuthContext from "../store/AuthContext";
import classes from "./User.module.css";
import ChangeProfile from "../components/User/ChangeProfile";
import Favorites from "../components/User/Favorites";
import Going from "../components/User/Going";
import PasswordReset from "../components/PasswordReset/PasswordReset";
import UsersList from "../components/Admin/UsersList";

const User = () => {
    const [userData, setUserData] = useState([]);
    const [activeLink, setActiveLInk] = useState('profile');
    const {user} = useContext(AuthContext);

    const shouldLog = useRef(true);

    const handleLinkClick = (link) => {
        setActiveLInk(link);
    }

    let activeComponent;

    if (activeLink === 'profile') {
        activeComponent = <ChangeProfile name={userData.firstName} surname={userData.lastName} id={userData.id}
                                         setUser={setUserData}></ChangeProfile>

    } else if (activeLink === 'favorites') {
        activeComponent = <Favorites/>;
    } else if (activeLink === 'going') {
        activeComponent = <Going/>;
    } else if (activeLink === 'password') {
        activeComponent = <PasswordReset/>
    }else if (activeLink === "allUsers"){
        activeComponent = <UsersList/>
    }

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const currentDate = new Date();
            const timeToken = new Date(user.exp * 1000);

            let tokenData = JSON.parse(localStorage.getItem("tokens"));
            if (currentDate >= timeToken) {
                const payload = {
                    token: `${tokenData.refreshToken}`
                };
                axios.post(`${process.env.REACT_APP_BASE_URL}/authenticate/refresh`, payload)
                    .then(response => {
                        console.log(response.data);
                        localStorage.setItem("tokens", JSON.stringify(response.data));
                        const tokenKojiSeSalje = response.data.token;
                        let header = {
                            "Authorization": `Bearer ${tokenKojiSeSalje}`
                        }
                        return axios.get(`${process.env.REACT_APP_BASE_URL}/users/${user.Id}`, {headers: header})
                    })
                    .then((response) => {
                        setUserData(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });

            } else {
                let header = {
                    "Authorization": `Bearer ${tokenData.token}`
                }
                axios.get(`${process.env.REACT_APP_BASE_URL}/users/${user.Id}`, {headers: header})
                    .then(response => {
                        setUserData(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    })

            }
        }
        return () => {
            shouldLog.current = false;
        }

    }, [])

    console.log(user);

    return (
        <div className={classes["background-container"]}>
            <div className={classes["container"]}>
                <div className={classes["container-upper"]}>
                    <div className={classes["container-left-nav"]}>
                        <div className={classes["container-name-surname"]}>
                            <label>{userData.firstName + " " + userData.lastName}</label>
                            <p className={classes["item-menu-email"]}>{userData.email}</p>
                        </div>

                        <a
                            className={`${classes['item-menu']} ${activeLink === 'profile' ? classes['active'] : ''}`}
                            href="#"
                            onClick={() => handleLinkClick('profile')}
                        >
                            Change profile
                        </a>
                        <a
                            className={`${classes['item-menu']} ${activeLink === 'password' ? classes['active'] : ''}`}
                            href="#"
                            onClick={() => handleLinkClick('password')}
                        >
                            Reset password
                        </a>
                        {user.Roles==="Admin" && <a
                            className={`${classes['item-menu']} ${activeLink === 'allUsers' ? classes['active'] : ''}`}
                            href="#"
                            onClick={() => handleLinkClick('allUsers')}
                        >
                            All users
                        </a>}
                        <a
                            className={`${classes['item-menu']} ${activeLink === 'favorites' ? classes['active'] : ''}`}
                            href="#"
                            onClick={() => handleLinkClick('favorites')}
                        >
                            Favorites
                        </a>
                        <a
                            className={`${classes['item-menu-bottom']} ${activeLink === 'going' ? classes['active'] : ''}`}
                            href="#"
                            onClick={() => handleLinkClick('going')}
                        >
                            Going
                        </a>
                        
                    </div>
                </div>
                <div className={classes["container-right"]}>
                    <div className={classes["container-form"]}>
                        {activeComponent}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default User;