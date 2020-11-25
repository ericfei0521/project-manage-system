import React from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signup } from "../action/action";

function Signup() {
  // let dispatch = useDispatch();
  return (
    <div className="App">
      <Link to="/signup" className="brand-logo">
        <img src={logo} alt="" width="80px" />
      </Link>
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button>signup</button>
    </div>
  );
}

export default Signup;
