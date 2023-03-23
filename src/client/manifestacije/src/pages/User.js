import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import AuthContext from "../store/AuthContext";

const User = async () => {
    const [userData, setUserData] = useState([]);
    const {user} = useContext(AuthContext);

    const shouldLog = useRef(true);
    useEffect(() => {

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
                    const result = await axios.post("https://localhost:7237/authenticate/refresh", payload)
                        // .then(response => {
                        //     console.log(response);
                        //     localStorage.setItem("tokens", JSON.stringify(response.data))
                        //     tokenData = response.data;
                        //     console.log("tokenData posle ");
                        //     console.log(tokenData)
                        // }).catch(error => {
                        //     console.log(error)
                        // })
                    localStorage.setItem("tokens", JSON.stringify(result.data))
                    return result.data
                }
                refresh();
            }
            const getUsersData = async () => {
                setTimeout(async () => {
                    console.log("token koji se salje ");
                    const tokenKojiSeSalje = localStorage.getItem("tokens");
                    console.log(tokenKojiSeSalje);
                    let header = {
                        "Authorization": `Bearer ${tokenData.token}`
                    }
                    const result = await axios.get(`https://localhost:7237/users/${user.Id}`, {headers: header})
                    return result.data
                }, 1000)
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