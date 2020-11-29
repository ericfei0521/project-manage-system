import React from "react";
import logo from "../images/logo.png";
import Footer from "./footer";
import style from "../style/welcome.module.scss";
import { auth } from "../firebase";
import { Link, useHistory } from "react-router-dom";

// import { useDispatch } from "react-redux";
// import { signup } from "../action/action";

function Welcome() {
  // let dispatch = useDispatch();
  let history = useHistory();
  auth.onAuthStateChanged((user) => {
    if (user) {
      history.push("/projects");
    }
  });
  return (
    <div className={style.app}>
      <div className={style.header}>
        <Link to="/" className="brand-logo">
          <img src={logo} alt="" width="80px" />
        </Link>
        <div className={style.btngroup}>
          <Link to="/login">
            <h1>Log In</h1>
          </Link>
          <Link to="/signup">
            <h1>Sign up</h1>
          </Link>
        </div>
      </div>
      <div>
        <Link to="/login">
          <h1>Get started for free</h1>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Welcome;
