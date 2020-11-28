import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../action/action";
import { auth, signInWithGoogle, createNewUser } from "../firebase";

function Login() {
  let dispatch = useDispatch();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let history = useHistory();

  auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
      createNewUser(userAuth);
      history.push("/project");
    }
  });
  return (
    <div className="App">
      <Link to="/" className="brand-logo">
        <img src={logo} alt="" width="80px" />
      </Link>
      <div>
        <h1>Login THE RAVEN</h1>
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
        <button onClick={signInWithGoogle}>Continue with Google</button>
      </div>
    </div>
  );
}

export default Login;
