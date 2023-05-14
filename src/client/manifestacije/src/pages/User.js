﻿import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import AuthContext from "../store/AuthContext";

const User = () => {
    const [userData, setUserData] = useState([]);
    const {user} = useContext(AuthContext);

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const currentDate = new Date();
            const vremeTokena = new Date(user.exp * 1000);

            let tokenData = JSON.parse(localStorage.getItem("tokens"));
            if (currentDate >= vremeTokena) {
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
                        setUserData(response.data)
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
                        setUserData(response.data)
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

    return (
        <div>
            <p>{userData.firstName}</p>
        </div>
    )
}
export default User;