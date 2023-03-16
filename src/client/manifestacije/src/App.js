import LoginInput from "./components/Login/LoginInput";
import { Fragment } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          {/*<Route path="/" element={<Home />} />  <-- treba se dodati home page*/}
          <Route path="/login" element={<LoginInput />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
