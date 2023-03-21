import axios from "axios";

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.request.use((request) => {
    
    let tokenData = JSON.parse(localStorage.getItem("tokens"));
    request.headers["Authorization"] = `Bearer ${tokenData.token}`;
    return request;
});
jwtInterceptor.interceptors.response.use(response => {
    // console.log(response);
    return response;
},  async (error) => {
    // console.log(error.response.status);
    if (error.response.status === 401){
        const authData = JSON.parse(localStorage.getItem("tokens"));
        // console.log(authData.refreshToken);
        const payload = {
            token: `${authData.refreshToken}`,
        };
        let apiResponse = await axios.post(
            "https://localhost:7237/authenticate/refresh",
            payload
        )
        localStorage.setItem("tokens",JSON.stringify(apiResponse.data))
        error.config.headers["Authorization"] = `Bearer ${apiResponse.data.token}`
        
        // console.log(apiResponse);
        // console.log(error);
        return axios(error.config);
    }
    else {
        return Promise.reject(error);
    }
})
export default jwtInterceptor;