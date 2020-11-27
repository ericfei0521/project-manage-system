import React from "react";
import logo from "../../images/logo.svg";
import Clock from "./clock";
import { Link } from "react-router-dom";

const Header = () => {
  // function componentDidMount(){
  //   setInterval(new Date(),1000)
  // }
  console.log();
  return (
    <div>
      <Link to="/project">
        <img src={logo} alt="" width="80px" />
      </Link>
      <div>{/* <Clock /> */}</div>
    </div>
  );
};

export default Header;
