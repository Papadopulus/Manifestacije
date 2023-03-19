import {useContext, useEffect, useRef, useState} from "react";
// import axios from "axios";
import axios from "../api/axios";
import AuthContext from "../store/AuthContext";
import jwtInterceptor from "../api/interceptors";
import {request} from "axios";
import {Await} from "react-router-dom";


const User = () => {
    
    // console.log('User component beeing redner...')
    
    const [userData,setUserData] = useState([]);
    const {user} = useContext(AuthContext);

    const shouldLog = useRef(true);
    useEffect(  () => {
        
        if (shouldLog.current) {
            // console.log('Mounting...')
            shouldLog.current =false;
            const getUserInfo = async () => {
                await jwtInterceptor.get(`https://localhost:7237/users/${user.Id}`)
                    .then((response) => {
                        setUserData(response.data);
                        console.log(response.data);
                    }).catch(error => {
                    console.error(error);
                })
            }
            getUserInfo();
        }
        return () => {
            // console.log('Unmounting...')
            shouldLog.current = false;
        }

    },[])
    // console.log(userData.firstName)
    return <div>
        {/*{!userData && <p>userData.firstName</p>}*/}
        <p>{userData.firstName}</p>
    </div>
}
export default User;