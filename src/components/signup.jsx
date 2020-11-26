import React, { useState } from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../action/action";

function Signup() {
  let dispatch = useDispatch();
  const state = useSelector((state) => state.Signup);
  let [email, setEmail] = useState(state.email);
  let [password, setPassword] = useState(state.password);
  let [confirm, setConfirm] = useState(state.confirmpassword);
  return (
    <div className="App">
      <Link to="/signup" className="brand-logo">
        <img src={logo} alt="" width="80px" />
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
        type="text"
        placeholder="password"
      />
      <input
        onChange={(e) => setConfirm(e.target.value)}
        value={confirm}
        type="text"
        placeholder="comfrim password"
      />
      <button
        onClick={() => {
          dispatch(
            signup({
              email: email,
              password: password,
              confirmpassword: confirm,
            })
          );
        }}
      >
        signup
      </button>
    </div>
  );
}

export default Signup;
