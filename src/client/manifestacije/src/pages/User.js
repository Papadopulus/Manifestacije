import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
// import axios from "../api/axios";
import AuthContext from "../store/AuthContext";
import jwtInterceptor from "../api/interceptors";
import {request} from "axios";
import {Await} from "react-router-dom";


const User = () => {

    // console.log('User component beeing redner...')

    const [userData, setUserData] = useState([]);
    const {user} = useContext(AuthContext);

    const shouldLog = useRef(true);
    useEffect( () => {

        if (shouldLog.current) {

            shouldLog.current = false;
            const currentDate = new Date();
            const vremeTokena = new Date(user.exp * 1000);

            let tokenData = JSON.parse(localStorage.getItem("tokens"));
            console.log("tokenData pre")
            console.log(tokenData)
            if (currentDate >= vremeTokena) {
                console.log("treba da se zameni token")

                const payload = {
                    token: `${tokenData.refreshToken}`
                };
                const refresh = async () => {
                    await axios.post(
                        "https://localhost:7237/authenticate/refresh",
                        payload
                    )
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("tokens", JSON.stringify(response.data))
                            tokenData = response.data;
                            console.log("tokenData posle ");
                            console.log(tokenData)
                        }).catch(error => {
                            console.log(error)
                        })

                }
                refresh();
            }
            const getUsersData = async () => {
                setTimeout(() => {

                },1000)
                console.log("token koji se salje ");
                const tokenKojiSeSalje = localStorage.getItem("tokens");
                console.log(tokenKojiSeSalje);
                let header = {
                    "Authorization": `Bearer ${tokenData.token}`
                }
                await axios.get(`https://localhost:7237/users/${user.Id}`, {headers: header})
                    .then((response) => {
                        setUserData(response.data);
                        console.log("podaci")
                        console.log(response.data);
                    }).catch(error => {
                        console.error(error);
                    })
            }
            getUsersData()
        }
        return () => {
            shouldLog.current = false;
        }

    }, [])

    // console.log(userData.firstName)
    return <div>
        {/*{!userData && <p>userData.firstName</p>}*/}
        <p>{userData.firstName}</p>
    </div>
}
export default User;