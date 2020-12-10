import React, { useState, useEffect } from "react";
import logo from "../../images/logo.png";
import Clock from "./clock";
import Notice from "./notice";
import firebase from "firebase/app";
import bell from "../../images/ICON/notification.svg";
import style from "../../style/header.module.scss";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = (prop) => {
  const user = useSelector((state) => state.UserCheck);
  let [userdetail, setUserDetail] = useState("");
  let [username, setUserName] = useState("");
  let [noticenumber, setNoticenumber] = useState([]);
  let [noticeList, setNoticeList] = useState([]);
  let [check, setCheck] = useState(false);
  useEffect(() => {
    if (user) {
      firestore
        .collection("users")
        .doc(user)
        .onSnapshot((doc) => {
          let data = doc.data();
          if (data.displayName !== undefined) {
            setUserName(data.displayName);
            setUserDetail(data);
            setNoticenumber(data.comment);
            firestore
              .collection("comment")
              .orderBy("time", "desc")
              .onSnapshot((doc) => {
                let list = [];
                let current = [];
                doc.forEach((item) => {
                  list.push(item.data());
                });
                list.forEach((item) => {
                  for (let i in data.comment) {
                    if (item.id === data.comment[i]) {
                      current.push(item);
                    }
                  }
                });
                setNoticeList(current);
              });
          }
        });
    }
  }, []);
  const readindividual = (value) => {
    console.log(user);
    console.log(value);
    firestore
      .collection("users")
      .doc(user)
      .update({
        comment: firebase.firestore.FieldValue.arrayRemove(value),
      });
  };
  const readall = () => {
    firestore.collection("users").doc(user).update({
      comment: [],
    });
  };
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
      <div className={style.middle}>
        {prop.name ? (
          <h1>Project: {prop.name}</h1>
        ) : (
          <img src={logo} alt="" width="80px" className={style.logo} />
        )}
      </div>

      <div className={style.right}>
        <div className={style.notice}>
          <img src={bell} alt="" onClick={() => setCheck(!check)} />
          {noticenumber.length === 0 ? (
            <></>
          ) : (
            <div className={style.noticenum}>
              <h2 style={{ color: "white" }}>{noticenumber.length}</h2>
            </div>
          )}
        </div>
        <button className={style.user}>
          <h1>{username.charAt(0)}</h1>
        </button>
      </div>
      {check ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            width: "300px",
            top: "110px",
            zIndex: 200,
            padding: "10px",
            backgroundColor: "rgba(50,50,50,0.8)",
            backdropFilter: "blur(10px)",
            height: "80vh",
            overflow: "auto",
          }}
        >
          <button
            onClick={() => {
              readall();
              setCheck(!check);
            }}
          >
            Read All
          </button>
          {noticeList.map((item) => (
            <Notice data={item} read={readindividual} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
