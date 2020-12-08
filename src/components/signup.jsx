import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../action/action";
import { auth } from "../firebase";

function Signup() {
  let dispatch = useDispatch();
  const state = useSelector((state) => state.Signup);
  let [email, setEmail] = useState(state.email);
  let [password, setPassword] = useState(state.password);
  let [confirm, setConfirm] = useState(state.confirmpassword);
  let [name, setName] = useState(state.confirmpassword);
  let history = useHistory();

  auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
      history.push("/projects");
    }
  });

  return (
    <div className="App">
      <Link to="/" className="brand-logo">
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
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        placeholder="Enter User Name"
      />
      <button
        onClick={() => {
          dispatch(
            signup({
              email: email,
              password: password,
              confirmpassword: confirm,
              displayName: name,
            })
          );
          setEmail("");
          setPassword("");
          setConfirm("");
          setName("");
        }}
      >
        signup
      </button>
    </div>
  );
}

export default Signup;
