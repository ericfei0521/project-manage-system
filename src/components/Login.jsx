import React, { useState } from "react";
import logo from "../images/logo.png";
import button from "../style/button.module.scss";
import style from "../style/login.module.scss";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../action/action";
import { auth, signInWithGoogle, createNewUser } from "../firebase";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
      createNewUser(userAuth);
      history.push("/projects");
    }
  });
  return (
    <div className={style.login}>
      <div className={style.wrap}>
        <div className={style.loginblock}>
          <Link to="/" className="brand-logo">
            <img src={logo} alt="" width="70px" />
          </Link>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="password"
          />
          <button
            className={button.button}
            onClick={() => {
              dispatch(
                login({
                  email: email,
                  password: password,
                })
              );
              setEmail("");
              setPassword("");
            }}
          >
            Submit
          </button>
          <button
            className={button.button}
            onClick={() => {
              dispatch(
                login({
                  email: "demouser@gmail.com",
                  password: "demouser",
                })
              );
            }}
          >
            Try THE RAVEN
          </button>
          <h2> - - - - - - - - - or - - - - - - - - - </h2>
          <button onClick={signInWithGoogle} className={style.logingoogle}>
            Login With Google
          </button>
          <Link to="/signup" className={style.signup}>
            <button className={style.button}>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
