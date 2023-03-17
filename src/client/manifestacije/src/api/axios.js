import axios from "axios";
// export default axios.create({
//     baseURL:'https://localhost:7237'
// })

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.request.use((config) => {

    // console.log(localStorage.getItem("tokens"));
    let tokenData = JSON.parse(localStorage.getItem("tokens"));
    console.log(tokenData.token);
    config.headers = config.headers || {};
    config.headers.common = config.headers.common || {};
    config.headers.common['Authorization'] = `Bearer ${tokenData.token}`;
    return config;
});

// jwtInterceptor.interceptors.response.use((response) => {
//     return response;
// },
//     async (error) => {
//     if (error.response.status === 401)
//     {
//         let tokenData = JSON.parse(localStorage.getItem("tokens"));
//         let payload={
//             token: tokenData.refreshToken,
//         };
//         let apiResponse = await axios.post("https://localhost:7237/authenticate/refresh",JSON.stringify(payload));
//         localStorage.setItem("tokens",apiResponse.data);
//        
//         error.config.headers['Authorization'] = `Bearer ${apiResponse.data.token}`;
//         return axios(error.config);
//     }
//     else {
//         return Promise.reject(error);
//     }
// })
export default jwtInterceptor;