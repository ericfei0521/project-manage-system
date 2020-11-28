import React from "react";
import githubIcon from "../images/github.svg";

const Footer = () => {
  return (
    <div>
      <h3>@ 2020 THE RAVEN All rights reserved </h3>
      <a href="https://github.com/ericfei0521?tab=repositories">
        <img src={githubIcon} alt="" />
      </a>
    </div>
  );
};

export default Footer;
