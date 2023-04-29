import LoginInput from "./components/Login/LoginInput";
import {Fragment} from "react";
import Navbar from "./components/Navbar/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import {AuthContextProvider} from "./store/AuthContext";
import User from "./pages/User";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import RegisterInput from "./components/Register/RegisterInput";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import OrganisationEvent from "./components/Organizator/OrganisationEvent";
import AdminPanel from "./components/Admin/AdminPanel";

function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <AuthContextProvider>
                    <Navbar></Navbar>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={
                            <ProtectedRoutes accessBy={"non-authenticated"}>
                                <LoginInput/>
                            </ProtectedRoutes>}/>
                        <Route path="/user" element={
                            <ProtectedRoutes accessBy={"authenticated"}>
                                <User/>
                            </ProtectedRoutes>
                        }/>

                        <Route path="/register" element={<RegisterInput />} />
                        
                        <Route path={"/organisation/event"} element={
                            <ProtectedRoutes accessBy={"authenticated"} allowedRoles={["Organization","Admin"]}>
                                <OrganisationEvent/>
                            </ProtectedRoutes>}/>

                        <Route path={"/adminPanel"} element={
                            <ProtectedRoutes accessBy={"authenticated"} allowedRoles={["Admin"]}>
                                <AdminPanel/>
                            </ProtectedRoutes>}/>

                        /*treba da se izbrise,stavio sam samo zbog testiranja*/
                        <Route path="/reset" element={<PasswordReset />} />

                    </Routes>
                </AuthContextProvider>
            </BrowserRouter>

        </Fragment>
    );
}

export default App;
