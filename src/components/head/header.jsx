import React from "react";
import logo from "../../images/logo.png";
import Clock from "./clock";
import { Link } from "react-router-dom";

const Header = (prop) => {
  console.log();
  return (
    <div>
      <Link to="/projects">
        <img src={logo} alt="" width="80px" />
      </Link>
      <div>
        <Clock />
      </div>
      {prop.name ? <h1>Project: {prop.name}</h1> : <></>}
    </div>
  );
};

export default Header;
