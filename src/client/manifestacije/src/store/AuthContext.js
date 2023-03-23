// import axios from "../api/axios";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const { createContext } = require("react");

const AuthContext = createContext(undefined);

const LOGIN_URL = '/authenticate';
export const AuthContextProvider = ({children}) => {

    const [user,setUser] = useState(() => {
        if (localStorage.getItem("tokens")){
            let tokenData = JSON.parse(localStorage.getItem("tokens"));
            let accessToken = jwt_decode(tokenData.token);
            // console.log(accessToken);
            return accessToken;
        }
        return null;
    });
    const navigate = useNavigate();
    const login = async (payload) => {
        const apiResponse = await axios.post("http://localhost:5214/authenticate",payload);
        // console.log(apiResponse);
        localStorage.setItem("tokens",JSON.stringify(apiResponse.data));
        // localStorage.setItem("expiration",JSON.stringify(apiResponse.exp));
        let accessToken = jwt_decode(apiResponse.data.token)
        console.log(accessToken);
        // console.log(Date.now())
        // console.log(new Date(Date.now()))
        const date = new Date(accessToken.exp * 1000)
        // console.log(date);
        localStorage.setItem("expiration",JSON.stringify(accessToken.exp))
        setUser(accessToken);
        // console.log(user);
        navigate("/");
    }
    const logout = () => {
        localStorage.removeItem("tokens");
        setUser(null);
        navigate("/");
    }
    return <AuthContext.Provider
        value={{ login , user ,logout }}>

        {children}

    </AuthContext.Provider>;
}
export default AuthContext