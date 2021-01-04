import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import Notice from "./Notice";
import bell from "../../images/ICON/notification.svg";
import style from "../../style/header.module.scss";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateDoc, updateSubDoc } from "../../utils/util";

const Header = (prop) => {
  const user = useSelector((state) => state.UserCheck);
  const [userdetail, setUserDetail] = useState("");
  const [editProjectName, setEditProjectName] = useState(false);
  const [projectName, setProjectName] = useState(prop.name);
  const [username, setUserName] = useState("");
  const [noticenumber, setNoticenumber] = useState([]);
  const [noticeList, setNoticeList] = useState([]);
  const [check, setCheck] = useState(false);
  const [usershow, setUserShow] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = firestore
      .collection("users")
      .doc(user)
      .onSnapshot((doc) => {
        const data = doc.data();
        if (data !== undefined) {
          const name = String(data.displayName);
          setUserName(name);
          setUserDetail(data);
          setNoticenumber(data.comment);
          firestore
            .collection("comment")
            .orderBy("time", "desc")
            .get()
            .then((doc) => {
              const list = [];
              const current = [];
              doc.forEach((item) => {
                list.push(item.data());
              });
              list.forEach((item) => {
                for (const i in data.comment) {
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
  const handleproject = (e) => {
    if (e.key === "Enter") {
      setEditProjectName(false);
      if (projectName !== "") {
        updateDoc("projects", prop.id, "updateItem", "name", projectName);
        firestore
          .collection("projects")
          .doc(prop.id)
          .collection("channel")
          .where("from", "==", "system")
          .get()
          .then((item) => {
            const doc = item.docs[0];
            doc.ref.update({
              text: `Welcome to ${projectName} channel`,
            });
          });

        firestore
          .collection("subtasks")
          .where("project", "==", prop.id)
          .get()
          .then((data) => {
            data.forEach((item) => {
              firestore
                .collection("subtasks")
                .doc(item.id)
                .collection("jobs")
                .get()
                .then((jobs) => {
                  jobs.forEach((job) => {
                    updateSubDoc(
                      "subtasks",
                      item.id,
                      "jobs",
                      job.id,
                      "updateItem",
                      "projectName",
                      projectName
                    );
                  });
                });
            });
          });
      }
    }
  };
  const projectNameSwitch = () => {
    if (editProjectName) {
      return (
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
      );
    } else {
      return (
        <h1
          className={style.projectname}
          onClick={() => {
            setEditProjectName(true);
          }}
          key={prop.id}
        >
          {projectName}
        </h1>
      );
    }
  };
  return (
    <div className={style.head}>
      <div className={style.left}>
        {prop.name ? (
          projectNameSwitch()
        ) : (
          <div className={style.home}>
            <Link to="/projects">
              <h1>Home </h1>
            </Link>
            <Clock />
          </div>
        )}
        {prop.state && (
          <select
            onChange={(e) => {
              updateDoc(
                "projects",
                prop.id,
                "updateItem",
                "state",
                e.target.value
              );
            }}
            value={prop.state}
          >
            <option value="On-hold">On-hold</option>
            <option value="Running">Running</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Rejected">Rejected</option>
            <option value="Complete">Complete</option>
          </select>
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
          {noticenumber.length === 0 || (
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
          {username ? <h1>{username.charAt(0)}</h1> : <h1>T</h1>}
        </button>
      </div>
      <div
        className={`${style.userinfo} ${usershow ? style.userinfoshow : ""}`}
      >
        <div className={style.info}>
          <h2>Name :</h2>
          <h3>{userdetail.displayName}</h3>
          <h2>Email :</h2>
          <h3>{userdetail.email}</h3>
        </div>
        <button onClick={() => prop.signOut()}>Log Out</button>
      </div>
      <div className={`${style.noticearea} ${check && style.noticeshow}`}>
        <button
          onClick={() => {
            updateDoc("users", user, "updateItem", "comment", []);
            setCheck(!check);
          }}
        >
          Read All
        </button>
        {noticeList.map((item) => (
          <Notice key={item.id} data={item} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Header;
