import axios from "axios";
import jwt_decode from "jwt-decode";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const { createContext } = require("react");

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({children}) => {

    const [errorMessageLogin,setErrorMessageLogin] = useState(null)
    const [user,setUser] = useState(() => {
        if (localStorage.getItem("tokens")){
            let tokenData = JSON.parse(localStorage.getItem("tokens"));
            return jwt_decode(tokenData.token);
        }
        return null;
    });
    const navigate = useNavigate();
    const login = async (payload) => {
        try {
            const apiResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/authenticate`,payload);
            localStorage.setItem("tokens",JSON.stringify(apiResponse.data));
            let accessToken = jwt_decode(apiResponse.data.token)
            localStorage.setItem("expiration",JSON.stringify(accessToken.exp))
            setUser(accessToken);
            navigate("/");
        }
        catch (err) {
            console.log(err.response.status);
            setErrorMessageLogin("Wrong email or password");
        }
        
    }
    const register = async (payload) => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/users`,payload);
        navigate("/login");
    }
    const logout = async () => {
        localStorage.removeItem("tokens");
        localStorage.removeItem("expiration");
        setUser(null);
        navigate("/login");
    }
    
    return <AuthContext.Provider
        value={{ login,register,errorMessageLogin , user ,logout }}>

        {children}

    </AuthContext.Provider>;
}
export default AuthContext