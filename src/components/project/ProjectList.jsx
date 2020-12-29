import React, { useState, useEffect } from "react";
import Header from "../Head/Header";
import logo from "../../images/logowelcome.png";
import { ReactComponent as ProjectIcon } from "../../images/ICON/projects.svg";
import { ReactComponent as TasksIcon } from "../../images/ICON/tasks.svg";
import { ReactComponent as ChatIcon } from "../../images/ICON/chat.svg";
import PrjectCard from "./prjectCard";
import ProjectChannel from "./ProjectChannel";
import MemberTasks from "./MemberTasks";
import Loading from "../Loading";
import style from "../../style/projectList.module.scss";
import button from "../../style/button.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, firestore, timestamp } from "../../firebase";

function ProjectList() {
  const history = useHistory();
  const user = useSelector((state) => state.UserCheck);
  const projects = firestore.collection("projects");
  const [load, setLoad] = useState(true);
  const [activechannel, setActivechannel] = useState(false);
  const [currentchannel, setCurrentchannel] = useState("");
  const [currentShow, setCurrentShow] = useState("all");
  const [dataProject, setProjects] = useState([]);
  const [isAdd, setAdd] = useState(false);
  const [newProjectName, setNewProjectsName] = useState("");
  const [newProjectState, setNewProjectState] = useState("On-hold");
  const [showsidemenu, setShowSidemenu] = useState(false);
  //監聽使用者登入
  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
    const unsubscribeList = projects.orderBy("time").onSnapshot(function (doc) {
      const updateData = [];
      doc.forEach((item) => {
        const member = item.data().member;
        if (member.includes(user)) {
          const dataitem = {
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
  const handlechannel = () => {
    if (dataProject.length > 0) {
      setCurrentchannel(dataProject[0].id);
    } else {
      setCurrentchannel("");
    }
  };
  return (
    <div>
      <div className={style.projectList}>
        <div
          className={style.burgermenu}
          onClick={() => setShowSidemenu(true)}
        ></div>
        <div
          className={`${style.sidebar} ${
            showsidemenu ? style.sidebarOpen : ""
          }`}
        >
          <div className={style.logo}>
            <Link to="/projects">
              <img src={logo} alt="" />
            </Link>
            <button onClick={() => setShowSidemenu(false)}></button>
          </div>
          <div
            className={style.sidebutton}
            style={
              currentShow === "all" || currentShow === "projects"
                ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
                : { backgroundColor: "transparent" }
            }
          >
            <ProjectIcon className={style.icon} />
            <button
              onClick={() => {
                setCurrentShow("projects");
                setCurrentchannel("");
                setActivechannel(false);
              }}
            >
              Project list
            </button>
          </div>
          <div
            className={style.sidebutton}
            style={
              currentShow === "tasks"
                ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
                : { backgroundColor: "transparent" }
            }
          >
            <TasksIcon className={style.icon} />
            <button
              onClick={() => {
                setCurrentShow("tasks");
                setCurrentchannel("");
                setActivechannel(false);
              }}
            >
              Tasks
            </button>
          </div>
          <div className={style.channels}>
            <div
              className={style.sidebutton}
              style={
                currentShow === "channel" || currentShow === "channels"
                  ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
                  : { backgroundColor: "transparent" }
              }
            >
              <ChatIcon className={style.icon} />
              <button
                onClick={() => {
                  setActivechannel(!activechannel);
                  setCurrentShow("channel");
                  handlechannel();
                }}
              >
                Channel
              </button>
            </div>
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
                  {item.name.length > 18 ? item.name.slice(0, 18) : item.name}
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
            {currentShow === "channel" ? (
              <div>
                {dataProject.length > 0 ? (
                  <ProjectChannel channelID={dataProject[0].id} />
                ) : (
                  <div className={style.noproject}>
                    <span>You are not in any project</span>
                  </div>
                )}
              </div>
            ) : (
              <> </>
            )}
            {currentShow === "channels" ? (
              <ProjectChannel channelID={currentchannel} />
            ) : (
              <></>
            )}
            {currentShow === "tasks" ? <MemberTasks user={user} /> : <></>}
            {currentShow === "all" || currentShow === "projects" ? (
              <div className={style.wrap}>
                <div className={style.show} id="displayzone">
                  {dataProject.map((item) => (
                    <PrjectCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      state={item.state}
                    />
                  ))}
                  {isAdd ? (
                    <div className={style.addCardInfo}>
                      <div className={style.infoarea}>
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
                      </div>
                      <div className={style.btns}>
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
                                const time = Date.now();
                                firestore
                                  .collection("projects")
                                  .doc(docRef.id)
                                  .collection("channel")
                                  .add({
                                    text: `Welcome to ${newProjectName} channel`,
                                    time: time,
                                    from: "system",
                                  });
                              });
                            setNewProjectsName("");
                            setNewProjectState("On-hold");
                            setAdd(false);
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAdd(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdd(true)}
                      className={style.addCard}
                    >
                      + new board
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
