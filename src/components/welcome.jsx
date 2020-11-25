import React from "react";
import logo from "../images/logo.svg";

import { Link, NavLink } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signup } from "../action/action";

function Welcome() {
  // let dispatch = useDispatch();
  return (
    <div className="App">
      <div>
        <Link to="/" className="brand-logo">
          <img src={logo} alt="" width="80px" />
        </Link>
        <button>
          <NavLink to="/login">Log In</NavLink>
        </button>
        <button>
          <NavLink to="/signup">Sign Up</NavLink>
        </button>
      </div>
    </div>
  );
}

export default Welcome;
