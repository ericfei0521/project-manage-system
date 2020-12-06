import React, { useState, useEffect } from "react";
import logo from "../../images/logo.png";
import Clock from "./clock";
import style from "../../style/header.module.scss";
import { auth, firestore } from "../../firebase";
import { Link } from "react-router-dom";

const Header = (prop) => {
  let [userID, setUserID] = useState("");
  let [userdetail, setUserDetail] = useState("");
  let [username, setUserName] = useState("");
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserID(user.uid);
    }
  });
  useEffect(() => {
    if (userID) {
      firestore
        .collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          setUserDetail(doc.data());
          setUserName(doc.data().displayName);
        });
    }
  }, [userID]);
  return (
    <div className={style.head}>
      <div className={style.left} style={{ width: "10%" }}>
        {prop.name ? (
          <Link to="/projects">
            <img src={logo} alt="" width="80px" />
          </Link>
        ) : (
          <></>
        )}
        <Clock />
      </div>
      {prop.name ? (
        <h1>Project: {prop.name}</h1>
      ) : (
        <Link to="/projects">
          <img src={logo} alt="" width="80px" />
        </Link>
      )}
      <div className={style.right} style={{ width: "10%" }}>
        <div></div>
        <button className={style.user}>
          <h1>{username.charAt(0)}</h1>
        </button>
      </div>
    </div>
  );
};

export default Header;
