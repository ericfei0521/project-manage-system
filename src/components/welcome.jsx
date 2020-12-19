import React from "react";
import logo from "../images/logo.png";
import video from "../images/testbackground.mp4";
import button from "../style/button.module.scss";
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
      <video autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
      <div className={style.filter}></div>
      <div className={style.header}>
        <Link to="/" className="brand-logo">
          <img src={logo} alt="" width="80px" />
        </Link>
        <div className={style.btngroup}>
          <Link to="/login">
            <button className={button.button}>Log In</button>
          </Link>
          <Link to="/signup">
            <button className={button.button}>Sign up</button>
          </Link>
        </div>
      </div>
      <div className={style.landing}>
        <div className={style.branding}>
          <div className={style.campaign}>
            <div className={style.sologon}>
              <h1>Welcome TO</h1>
              <h2>The Raven</h2>
              <p>&emsp;Use one manage all</p>
            </div>
            <Link to="/login">
              <button className={button.button}>Get started for free</button>
            </Link>
          </div>
        </div>

        <div className={style.footer}>
          <h3>@ 2020 THE RAVEN All rights reserved </h3>
          <a href="https://github.com/ericfei0521?tab=repositories">
            <div className={style.icon}></div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
