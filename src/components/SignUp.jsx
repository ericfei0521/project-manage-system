import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../action/action";
import { auth } from "../firebase";
import style from "../style/signup.module.scss";
function Signup() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Signup);
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState(state.password);
  const [confirm, setConfirm] = useState(state.confirmpassword);
  const [name, setName] = useState(state.confirmpassword);
  const history = useHistory();

  auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
      history.push("/projects");
    }
  });

  return (
    <div className={style.signup}>
      <div className={style.filter}>
        <div className={style.wrap}>
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
          <input
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm}
            type="password"
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
              if (email !== "" && password !== "" && name !== "") {
                setEmail("");
                setPassword("");
                setConfirm("");
                setName("");
              }
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
