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
            return accessToken;
        }
        return null;
    });
    const navigate = useNavigate();
    const login = async (payload) => {
        const apiResponse = await axios.post("https://localhost:7237/authenticate",payload);

        localStorage.setItem("tokens",JSON.stringify(apiResponse.data));
        let accessToken = jwt_decode(apiResponse.data.token)
        setUser(accessToken);
        console.log(user);
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