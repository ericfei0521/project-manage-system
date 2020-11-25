import React, { useState } from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../action/action";

function Login() {
  let dispatch = useDispatch();
  const state = useSelector((state) => state);
  let [email, setEmail] = useState(state.email);
  let [password, setPassword] = useState(state.password);

  return (
    <div className="App">
      <Link to="/login" className="brand-logo">
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
      </div>
    </div>
  );
}

export default Login;
