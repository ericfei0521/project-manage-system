import React, { useState, useEffect } from "react";
import logo from "../../images/logo.png";
import Clock from "./clock";
import Notice from "./notice";
import firebase from "firebase/app";
import bell from "../../images/ICON/notification.svg";
import style from "../../style/header.module.scss";
import button from "../../style/button.module.scss";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = (prop) => {
  const user = useSelector((state) => state.UserCheck);
  let [userdetail, setUserDetail] = useState("");
  let [editProjectName, setEditProjectName] = useState(false);
  let [projectName, setProjectName] = useState(prop.name);
  let [username, setUserName] = useState("");
  let [noticenumber, setNoticenumber] = useState([]);
  let [noticeList, setNoticeList] = useState([]);
  let [check, setCheck] = useState(false);
  let [usershow, setUserShow] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    let unsubscribe = firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        let data = doc.data();
        if (data !== undefined) {
          setUserName(data.displayName);
          setUserDetail(data);
          setNoticenumber(data.comment);
          firestore
            .collection("comment")
            .orderBy("time", "desc")
            .get()
            .then((doc) => {
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
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    setProjectName(prop.name);
  }, [prop]);
  const readindividual = (value) => {
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
  const handleproject = (e) => {
    if (e.key === "Enter") {
      setEditProjectName(false);
      if (projectName !== "") {
        firestore.collection("projects").doc(prop.id).update({
          name: projectName,
        });
      }
    }
  };
  const handleTaskState = (value) => {
    firestore.collection("projects").doc(prop.id).update({
      state: value,
    });
  };
  return (
    <div className={style.head}>
      <div className={style.left} style={{ width: "10%" }}>
        <Link to="/projects">
          <img src={logo} alt="" width="80px" />
        </Link>
        <Clock />
      </div>
      <div className={style.middle}>
        {prop.name ? (
          [
            editProjectName ? (
              <input
                value={projectName}
                type="text"
                autoFocus
                key={prop.name}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  handleproject(e);
                }}
              />
            ) : (
              <h1
                onClick={() => {
                  setEditProjectName(true);
                }}
                key={prop.id}
              >
                {projectName.length > 7
                  ? projectName.slice(0, 7) + "..."
                  : projectName}
              </h1>
            ),
          ]
        ) : (
          <></>
        )}
        {prop.state ? (
          <select
            onChange={(e) => {
              handleTaskState(e.target.value);
            }}
            value={prop.state}
          >
            <option value="On-hold">On-hold</option>
            <option value="Running">Running</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Rejected">Rejected</option>
            <option value="Complete">Complete</option>
          </select>
        ) : (
          <></>
        )}
      </div>

      <div className={style.right}>
        <div className={style.notice}>
          <img
            src={bell}
            alt=""
            onClick={() => {
              setCheck(!check);
              setUserShow(false);
            }}
          />
          {noticenumber.length === 0 ? (
            <></>
          ) : (
            <div className={style.noticenum}>
              <h2 style={{ color: "white" }}>{noticenumber.length}</h2>
            </div>
          )}
        </div>
        <button
          className={style.user}
          onClick={() => {
            setUserShow(!usershow);
            setCheck(false);
          }}
        >
          <h1>{username.charAt(0)}</h1>
        </button>
      </div>
      <div
        className={`${style.userinfo} ${usershow ? style.userinfoshow : ""}`}
      >
        <h2>{userdetail.displayName}</h2>
        <h2>{userdetail.email}</h2>
        <button onClick={() => prop.signOut()} className={button.button}>
          signout
        </button>
      </div>
      <div className={`${style.noticearea} ${check ? style.noticeshow : ""}`}>
        <button
          onClick={() => {
            readall();
            setCheck(!check);
          }}
        >
          Read All
        </button>
        {noticeList.map((item) => (
          <Notice key={item.id} data={item} read={readindividual} />
        ))}
      </div>
    </div>
  );
};

export default Header;
