import React from "react";
import logo from "../images/logo.svg";
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signup } from "../action/action";

function Welcome() {
  // let dispatch = useDispatch();
  let history = useHistory();
  auth.onAuthStateChanged((user) => {
    if (user) {
      history.push("/project");
    }
  });
  return (
    <div className="App">
      <div>
        <Link to="/" className="brand-logo">
          <img src={logo} alt="" width="80px" />
        </Link>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Welcome;
