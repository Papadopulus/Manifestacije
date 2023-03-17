import {useContext, useEffect, useState} from "react";
import axios from "axios";

import AuthContext from "../store/AuthContext";
import jwtInterceptor from "../api/axios";
const User = () => {
    
    const {user} = useContext(AuthContext);
    const [userData,setUserData] = useState([]);
    
    useEffect( () => {
        // let tokenData = JSON.parse(localStorage.getItem("tokens"));
        //
        // let header = { 
        //     "Authorization" : `Bearer ${tokenData.token}`
        // }
        jwtInterceptor.get(`https://localhost:7237/users/${user.Id}`)
            .then((response) => {
            setUserData(response.data);
            console.log(response.data);
        }).catch(Error => {
            console.error(Error);
        })

    },[])
    return <div>
        <p>Users Page</p>
    </div>
}
export default User;