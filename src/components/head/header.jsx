import React, { useState, useEffect } from "react";
import logo from "../../images/logo.png";
import Clock from "./clock";
import bell from "../../images/ICON/notification.svg";
import style from "../../style/header.module.scss";
import { auth, firestore } from "../../firebase";
import { Link } from "react-router-dom";

const Header = (prop) => {
  let [userID, setUserID] = useState("");
  // let [userdetail, setUserDetail] = useState('')
  let [username, setUserName] = useState("");
  let [noticenumber, setNoticenumber] = useState(0);
  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUserID(userAuth.uid);
      }
    });
    if (userID) {
      firestore
        .collection("users")
        .doc(userID)
        .onSnapshot((doc) => {
          let data = doc.data();
          if (data.displayName !== undefined) {
            setUserName(data.displayName);
            setNoticenumber(data.comment.length);
          }
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
      <div className={style.right}>
        <img src={bell} alt="" />
        <h2 style={{ color: "white" }}>{noticenumber}</h2>
        <button className={style.user}>
          <h1>{username.charAt(0)}</h1>
        </button>
      </div>
    </div>
  );
};

export default Header;
