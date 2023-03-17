import LoginInput from "./components/Login/LoginInput";
import {Fragment} from "react";
import Navbar from "./components/Navbar/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {AuthContextProvider} from "./store/AuthContext";
import User from "./pages/User";

function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <AuthContextProvider>
                    <Navbar></Navbar>
                    <Routes>
                        {/*<Route path="/" element={<Home />} />  <-- treba se dodati home page*/}
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<LoginInput/>}/>
                        <Route path="/user" element={<User/>}/>
                    </Routes>
                </AuthContextProvider>
            </BrowserRouter>

        </Fragment>
    );
}

export default App;
