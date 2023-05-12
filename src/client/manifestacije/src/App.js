import LoginInput from "./components/Login/LoginInput";
import { Fragment } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import { AuthContextProvider } from "./store/AuthContext";
import User from "./pages/User";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import RegisterInput from "./components/Register/RegisterInput";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import AboutPage from "./pages/AboutPage/AboutPage";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <AuthContextProvider>
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <ProtectedRoutes accessBy={"non-authenticated"}>
                  <LoginInput />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoutes accessBy={"authenticated"}>
                  <User />
                </ProtectedRoutes>
              }
            />
            <Route path="/register" element={<RegisterInput />} />
            <Route path="/reset" element={<PasswordReset />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
