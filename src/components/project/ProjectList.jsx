import React, { useState, useEffect } from "react";
import Header from "../head/header";
import logo from "../../images/logowelcome.png";
import PrjectCard from "./prjectCard";
import ProjectChannel from "./projectChannel";
import MemberTasks from "./membertasks";
import Loading from "../loading";
import Todos from "./Todos";
import style from "../../style/projectList.module.scss";
import button from "../../style/button.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, firestore, timestamp } from "../../firebase";

function ProjectList() {
  let history = useHistory();
  const user = useSelector((state) => state.UserCheck);
  let projects = firestore.collection("projects");
  let [load, setLoad] = useState(true);
  let [activechannel, setActivechannel] = useState(false);
  let [currentchannel, setCurrentchannel] = useState("");
  let [currentShow, setCurrentShow] = useState("all");
  let [dataProject, setProjects] = useState([]);
  let [isAdd, setAdd] = useState(false);
  let [newProjectName, setNewProjectsName] = useState("");
  let [newProjectState, setNewProjectState] = useState("On-hold");
  //監聽使用者登入
  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
    let unsubscribeList = projects.orderBy("time").onSnapshot(function (doc) {
      let updateData = [];
      doc.forEach((item) => {
        let member = item.data().member;
        if (member.includes(user)) {
          let dataitem = {
            name: item.data().name,
            id: item.id,
            state: item.data().state,
          };
          updateData.push(dataitem);
        }
      });
      setProjects(updateData);
      setTimeout(() => setLoad(false), 200);
    });
    return () => {
      unsubscribeList();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const routeChange = () => {
    auth.signOut().then(function () {
      history.push("/");
    });
  };

  return (
    <div>
      <div className={style.projectList}>
        <div className={style.sidebar}>
          <div className={style.logo}>
            <Link to="/projects">
              <img src={logo} alt="" />
            </Link>
            <button></button>
          </div>
          <button
            onClick={() => {
              setCurrentShow("projects");
              setCurrentchannel("");
            }}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setCurrentShow("tasks");
              setCurrentchannel("");
            }}
          >
            Tasks
          </button>
          <div className={style.channels}>
            <button onClick={() => setActivechannel(!activechannel)}>
              Channel
            </button>
            <div
              className={`${style.channel} ${
                activechannel ? style.channelOpen : ""
              }`}
            >
              {dataProject.map((item) => (
                <button
                  key={item.id}
                  className={`${style.button} ${
                    currentchannel === item.id ? style.buttonOn : ""
                  }`}
                  onClick={() => {
                    setCurrentchannel(item.id);
                    setCurrentShow("channels");
                  }}
                >
                  {item.name.length > 7 ? item.name.slice(0, 7) : item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={style.display}>
          <div className={style.header}>
            <Header id={null} state={null} name={null} signOut={routeChange} />
          </div>
          <div>
            {currentShow === "channels" ? (
              <ProjectChannel channelID={currentchannel} />
            ) : (
              <></>
            )}
            {currentShow === "todos" ? <Todos user={user} /> : <></>}
            {currentShow === "tasks" ? <MemberTasks user={user} /> : <></>}
            {currentShow === "all" || currentShow === "projects" ? (
              <div className={style.wrap}>
                <div className={style.show}>
                  {dataProject.map((item) => (
                    <PrjectCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      state={item.state}
                    />
                  ))}
                  <div></div>
                  {isAdd ? (
                    <div className={style.addCardInfo}>
                      <input
                        onChange={(e) => setNewProjectsName(e.target.value)}
                        value={newProjectName}
                        type="text"
                        placeholder="Project Name"
                      />
                      <select
                        onChange={(e) => setNewProjectState(e.target.value)}
                        value={newProjectState}
                      >
                        <option value="On-hold">On-hold</option>
                        <option value="Running">Running</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Complete">Complete</option>
                      </select>
                      <button
                        onClick={() => {
                          firestore
                            .collection("projects")
                            .add({
                              member: [user],
                              name: newProjectName,
                              state: newProjectState,
                              time: timestamp,
                            })
                            .then((docRef) => {
                              let time = Date.now();
                              firestore
                                .collection("projects")
                                .doc(docRef.id)
                                .collection("channel")
                                .add({
                                  text: `wlecome to ${newProjectName} channel`,
                                  time: time,
                                  from: "system",
                                });
                            });
                          setNewProjectsName("");
                          setNewProjectState("On-hold");
                          setAdd(true);
                        }}
                        className={button.button}
                      >
                        Add Project
                      </button>
                      <button
                        onClick={() => setAdd(false)}
                        className={button.button}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdd(true)}
                      className={style.addCard}
                    >
                      Create new board
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
}
export default ProjectList;
