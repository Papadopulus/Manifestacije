import axios from "axios";
import jwt_decode from "jwt-decode";
const checkTokenAndRefresh = async () => {
    const currentDate = new Date();
    let expiration = localStorage.getItem("expiration");
    const timeToken = new Date(expiration * 1000);
    let tokenData = JSON.parse(localStorage.getItem("tokens"));
    if (currentDate >= timeToken) {
        const payload = {
            token: `${tokenData.refreshToken}`
        };
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/authenticate/refresh`, payload);
        localStorage.setItem("tokens",JSON.stringify(response.data));
        let decodeToken = jwt_decode(response.data.token);
        localStorage.setItem("expiration",JSON.stringify(decodeToken.exp));
    }
}
export default checkTokenAndRefresh;
