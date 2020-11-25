import React from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signup } from "../action/action";

function Login() {
  // let dispatch = useDispatch();
  return (
    <div className="App">
      <Link to="/login" className="brand-logo">
        <img src={logo} alt="" width="80px" />
      </Link>
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button>Log in</button>
    </div>
  );
}

export default Login;
