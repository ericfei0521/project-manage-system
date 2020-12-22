import React, { useState, useEffect, useRef } from "react";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import Tasks from "./Tasks";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import TaskItem from "../Task/taskItem";
import Performance from "./performance";
import Loading from "../loading";
import userlog from "../../images/ICON/users.svg";
import adduser from "../../images/ICON/useregular.svg";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link, useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

const Project = () => {
  const inputref = useRef(null);
  let dispatch = useDispatch();
  let history = useHistory();
  let { projectId } = useParams();
  const state = useSelector((state) => state.HandleTaskMember);
  let project = firestore.collection("projects").doc(projectId);
  let [load, setLoad] = useState(true);
  let [open, setOpen] = useState(false);
  let [name, setName] = useState("");
  let [projectstate, setState] = useState("");
  let [listname, setListName] = useState("");
  let [memberNum, setMemberNum] = useState([]);
  let [tasks, setTasks] = useState([]);
  let [showdelete, setDelete] = useState(false);
  let [membershow, setMemberShow] = useState(false);
  let [showallusers, setAllusers] = useState(false);
  let [currentPage, setCurrentPage] = useState("all");
  let [confirm, setconfirm] = useState("");
  let [addCard, setAddcard] = useState(false);
  let [worning, setWorning] = useState(false);

  useEffect(() => {
    let unsubscribemember = project.onSnapshot(function (doc) {
      if (!doc.data()) {
        history.push("/");
      }
      // console.log(doc.data())
      if (doc.data() !== undefined) {
        let data = doc.data();
        setName(data.name);
        setState(data.state);
        let list = [];
        data.member.forEach((item) => {
          list.push(item);
        });
        setMemberNum(list);
      }
    });
    let unsubscribeAllmember = project
      .collection("tasks")
      .orderBy("createTime")
      .onSnapshot(function (doc) {
        let listTask = [];
        doc.forEach((item) => {
          let data = {
            id: item.id,
            name: item.data().name,
          };
          listTask.push(data);
        });
        setTasks(listTask);
      });
    return () => {
      unsubscribemember();
      unsubscribeAllmember();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setTimeout(() => setLoad(false), 1000);
  }, [tasks]);
  const handlemember = () => {
    setMemberShow(!membershow);
  };
  const handleAddmember = () => {
    setAllusers(!showallusers);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDrag = (result) => {
    console.log(result);
    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }
    const dropStart = result.source.droppableId;
    const dropEnd = result.destination.droppableId;
    console.log(dropStart);
    console.log(dropEnd);
    if (dropEnd === dropStart) {
      project
        .collection("tasks")
        .doc(dropStart)
        .get()
        .then((doc) => {
          const item = Array.from(doc.data().task);
          const [reorderItem] = item.splice(result.source.index, 1);
          item.splice(result.destination.index, 0, reorderItem);
          return item;
        })
        .then((item) => {
          project.collection("tasks").doc(dropStart).update({
            task: item,
          });
        });
    } else {
      console.log(result);
      project
        .collection("tasks")
        .doc(dropStart)
        .get()
        .then((doc) => {
          const item = Array.from(doc.data().task);
          item.splice(result.source.index, 1);
          console.log(item);
          project.collection("tasks").doc(dropStart).update({
            task: item,
          });
        });
      project
        .collection("tasks")
        .doc(dropEnd)
        .get()
        .then((doc) => {
          console.log(result.source);
          const item = Array.from(doc.data().task);
          item.splice(result.destination.index, 0, result.draggableId);
          console.log(item);
          project.collection("tasks").doc(dropEnd).update({
            task: item,
          });
        });
    }
  };
  const routeChange = () => {
    auth.signOut().then(function () {
      history.push("/");
    });
  };

  return (
    <div className={style.project}>
      <Header
        id={projectId}
        state={projectstate}
        name={name}
        signOut={routeChange}
      />
      <div className={style.nav}>
        <nav>
          <button
            className={style.navbutton}
            onClick={() => setCurrentPage("all")}
          >
            All list
          </button>
          <button
            className={style.navbutton}
            onClick={() => {
              setCurrentPage("tasks");
              dispatch(
                getMember({
                  show: membershow,
                  member: memberNum,
                })
              );
            }}
          >
            Tasks
          </button>
          <button
            className={style.navbutton}
            onClick={() => {
              setCurrentPage("performance");
              dispatch(
                getMember({
                  show: membershow,
                  member: memberNum,
                })
              );
            }}
          >
            performance
          </button>
        </nav>
        <div className={style.rightnav}>
          <div className={style.showmember}>
            <button
              className={style.memberbutton}
              onClick={() => {
                console.log(membershow);
                dispatch(
                  getMember({
                    show: membershow,
                    member: memberNum,
                  })
                );
                setMemberShow(!membershow);
              }}
            >
              <img src={userlog} alt="" />
            </button>
            {membershow ? (
              <div className={style.memberList}>
                <MemberList
                  projectid={projectId}
                  member={memberNum}
                  showmember={handlemember}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className={style.allList}>
            {showallusers ? (
              <div>
                <AlluserList
                  projectid={projectId}
                  member={memberNum}
                  showmember={handleAddmember}
                />
              </div>
            ) : (
              <></>
            )}
            <button
              className={style.memberbutton}
              onClick={() => {
                dispatch(
                  getMember({
                    show: membershow,
                    member: memberNum,
                  })
                );
                setAllusers(!showallusers);
              }}
            >
              <h2>+</h2>
              <img src={adduser} alt="" />
            </button>
          </div>
          <button
            className={style.showdele}
            onClick={() => setDelete(!showdelete)}
          >
            <div className={style.ball}></div>
            <div className={style.ball}></div>
            <div className={style.ball}></div>
          </button>
        </div>
      </div>
      {currentPage === "performance" ? (
        <Performance projectid={projectId} member={memberNum} name={name} />
      ) : (
        <></>
      )}
      {currentPage === "tasks" ? (
        <Tasks projectid={projectId} member={memberNum} />
      ) : (
        <></>
      )}
      {currentPage === "all" ? (
        <div className={style.projectlist}>
          <DragDropContext onDragEnd={handleDrag}>
            <div className={style.projects}>
              {tasks.map((item) => (
                <TaskList
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  open={handleOpen}
                />
              ))}
              <div className={style.addCard}>
                <button
                  className={`${style.addcardbutton} ${
                    addCard ? "" : style.openaddbutton
                  }`}
                  onClick={() => setAddcard(true)}
                >
                  + Add another list
                </button>
                <div
                  className={`${style.addcarddetail} ${
                    addCard ? style.openaddbutton : ""
                  }`}
                >
                  <input
                    onChange={(e) => setListName(e.target.value)}
                    className={worning ? style.worning : ""}
                    value={listname}
                    autoFocus
                    ref={inputref}
                    type="text"
                    placeholder="List Name"
                  />
                  <div className={style.detialbutton}>
                    <button
                      onClick={() => {
                        if (listname !== "") {
                          dispatch(
                            addList({
                              id: projectId,
                              name: listname,
                            })
                          );
                          setListName("");
                          setWorning(false);
                          setAddcard(false);
                        } else {
                          inputref.current.placeholder =
                            "Please enter list name";
                          setWorning(true);
                        }
                      }}
                    >
                      Add List
                    </button>
                    <button onClick={() => setAddcard(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </DragDropContext>
          {open ? (
            <div className={style.taskdetail}>
              <TaskItem
                taskID={state.taskID}
                id={state.id}
                name={state.name}
                state={state.state}
                open={handleOpen}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
      {showdelete ? (
        <div
          id="deleteoutside"
          className={style.delete}
          onClick={(e) => {
            e.target.id === "deleteoutside"
              ? setDelete(false)
              : setDelete(true);
          }}
        >
          <div className={style.deletannounce}>
            <div className={style.announce}>
              <h1>Delete this Project ?</h1>
              <p>
                Doing so will permanently delete the data,including all nested
                tasks
              </p>
            </div>
            <div className={style.confirm}>
              <div className={style.confirmannounce}>
                <p>
                  Confirm you want to delete this project by typing its ID :
                </p>
                <h2>{projectId}</h2>
              </div>
              <input
                type="text"
                autoFocus
                onChange={(e) => setconfirm(e.target.value)}
              />
              <Link
                to="/projects"
                className={style.delelink}
                style={
                  confirm === projectId
                    ? { pointerEvents: "auto" }
                    : { pointerEvents: "none" }
                }
              >
                <button
                  className={
                    confirm === projectId ? style.avaliable : style.disable
                  }
                  onClick={() => {
                    dispatch(
                      deleteProject({
                        projectId: projectId,
                      })
                    );
                  }}
                >
                  Delete
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Project;
