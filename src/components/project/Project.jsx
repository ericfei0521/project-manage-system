import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as ListIcon } from "../../images/ICON/alllist.svg";
import { ReactComponent as Membertasks } from "../../images/ICON/membertasks.svg";
import { ReactComponent as Progress } from "../../images/ICON/progress.svg";
import { ReactComponent as Members } from "../../images/ICON/users.svg";
import { ReactComponent as Addmember } from "../../images/ICON/useregular.svg";
import { ReactComponent as Delete } from "../../images/ICON/delete.svg";
import Header from "../Head/Header";
import TaskList from "../Task/TaskList";
import Tasks from "./Tasks";
import MemberList from "../MemberList/MemberList";
import AlluserList from "../MemberList/Alluser";
import TaskItem from "../Task/TaskItem";
import Performance from "./Performance";
import Loading from "../Loading";
import logo from "../../images/logowelcome.png";
import style from "../../style/project.module.scss";
import { addList, getMember } from "../../action/action";
import { useParams, Link, useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { deleteProject } from "../../utils/util";
const ProjectDetail = () => {
  const { projectId } = useParams();
  const state = useSelector((state) => state.HandleTaskMember);
  const project = firestore.collection("projects").doc(projectId);
  const inputref = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [projectstate, setState] = useState("");
  const [listname, setListName] = useState("");
  const [memberNum, setMemberNum] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showdelete, setDelete] = useState(false);
  const [membershow, setMemberShow] = useState(false);
  const [showallusers, setAllusers] = useState(false);
  const [currentPage, setCurrentPage] = useState("all");
  const [confirm, setconfirm] = useState("");
  const [addCard, setAddcard] = useState(false);
  const [allsub, setAllsub] = useState([]);
  const [showsidemenu, setShowSidemenu] = useState(false);

  useEffect(() => {
    const unsubscribemember = project.onSnapshot(function (doc) {
      if (!doc.data()) {
        history.push("/");
      }
      if (doc.data() !== undefined) {
        const data = doc.data();
        setName(data.name);
        setState(data.state);
        const list = [];
        data.member.forEach((item) => {
          list.push(item);
        });
        setMemberNum(list);
      }
    });
    const unsubscribeAlltasks = project
      .collection("tasks")
      .orderBy("createTime")
      .onSnapshot(function (doc) {
        const listTask = [];
        doc.forEach((item) => {
          const data = {
            id: item.id,
            name: item.data().name,
          };
          listTask.push(data);
        });
        setTasks(listTask);
      });
    const unsubscribeAllsubtasks = firestore
      .collection("subtasks")
      .onSnapshot((doc) => {
        const newallsub = [];
        doc.forEach((data) => {
          if (data.data().project === projectId) {
            const dataitem = {
              id: data.id,
              name: data.data().name,
              state: data.data().state,
              index: data.data().index,
              listid: data.data().listid,
              image: data.data().image,
            };
            newallsub.push(dataitem);
          }
        });
        setAllsub(newallsub);
      });
    return () => {
      unsubscribemember();
      unsubscribeAlltasks();
      unsubscribeAllsubtasks();
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
    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }
    const dropStart = result.source.droppableId;
    const dropEnd = result.destination.droppableId;
    const batch = firestore.batch();
    if (dropEnd === dropStart) {
      const newarray = allsub.filter((item) => item.listid !== dropEnd);
      const rearrangearray = allsub
        .filter((item) => item.listid === dropEnd)
        .sort((taskfirst, tasksecond) => taskfirst.index - tasksecond.index);
      const [reorderItem] = rearrangearray.splice(result.source.index, 1);
      rearrangearray.splice(result.destination.index, 0, reorderItem);
      for (let i = 0; i < rearrangearray.length; i++) {
        rearrangearray.forEach((data) => {
          if (rearrangearray[i].id === data.id) {
            data.index = i;
          }
        });
        const path = firestore.collection("subtasks").doc(rearrangearray[i].id);
        batch.update(path, { index: i });
      }
      rearrangearray.forEach((newitem) => {
        newarray.push(newitem);
      });
      setAllsub(newarray);
      batch.commit();
    } else {
      const newallsub = [...allsub];
      const sourcearray = allsub
        .filter((item) => item.listid === dropStart)
        .sort((a, b) => a.index - b.index);
      const sourceRearrangeid = [];
      sourcearray.forEach((data) => {
        sourceRearrangeid.push(data.id);
      });
      const item = Array.from(sourceRearrangeid);
      item.splice(result.source.index, 1);
      for (let i = 0; i < item.length; i++) {
        newallsub.forEach((data) => {
          if (data.id === item[i]) {
            data.index = i;
          }
        });
      }
      const destinationarray = allsub
        .filter((item) => item.listid === dropEnd)
        .sort((a, b) => a.index - b.index);
      const destinationarrayid = [];
      destinationarray.forEach((data) => {
        destinationarrayid.push(data.id);
      });
      const destitem = Array.from(destinationarrayid);
      destitem.splice(result.destination.index, 0, result.draggableId);
      destitem.forEach((data, index) => {
        for (const i in newallsub) {
          if (newallsub[i].id === data) {
            newallsub[i].index = index;
            newallsub[i].listid = dropEnd;
          }
        }
      });
      setAllsub(newallsub);
      newallsub.forEach((item) => {
        const path = firestore.collection("subtasks").doc(item.id);
        batch.update(path, {
          index: item.index,
          listid: item.listid,
        });
      });
      batch.commit();
    }
  };
  const routeChange = () => {
    auth.signOut().then(function () {
      history.push("/");
    });
  };
  return (
    <div className={style.project}>
      <div
        className={style.burgermenu}
        onClick={() => setShowSidemenu(true)}
      ></div>
      <div className={`${style.nav} ${showsidemenu ? style.sidebarOpen : ""}`}>
        <div className={style.logo}>
          <Link to="/projects">
            <img src={logo} alt="" />
          </Link>
          <button onClick={() => setShowSidemenu(false)}></button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => setCurrentPage("all")}
          style={
            currentPage === "all"
              ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
              : { backgroundColor: "transparent" }
          }
        >
          <ListIcon className={style.icon} />
          <button>Tasks list</button>
        </div>
        <div
          className={style.sidebutton}
          style={
            currentPage === "tasks"
              ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
              : { backgroundColor: "transparent" }
          }
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
          <Membertasks className={style.icon} />
          <button>Performance</button>
        </div>
        <div
          className={style.sidebutton}
          style={
            currentPage === "performance"
              ? { backgroundColor: "rgba(93, 93, 93, 0.602)" }
              : { backgroundColor: "transparent" }
          }
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
          <Progress className={style.icon} />
          <button>Progress</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
            setMemberShow(!membershow);
            setAllusers(false);
          }}
        >
          <Members className={style.icon} />
          <button>Members</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
            setAllusers(!showallusers);
            setMemberShow(false);
          }}
        >
          <Addmember className={style.icon} />
          <button>Add member</button>
        </div>
        <div
          className={style.showdelete}
          onClick={() => setDelete(!showdelete)}
        >
          <Delete className={style.delicon} />
          <button>Delete</button>
        </div>
      </div>
      <div className={style.displayarea}>
        <div className={style.header}>
          <Header
            id={projectId}
            state={projectstate}
            name={name}
            signOut={routeChange}
          />
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
        {currentPage === "all" && (
          <DragDropContext onDragEnd={handleDrag}>
            <div className={style.projectlist}>
              <div className={style.projects}>
                {tasks.map((item) => (
                  <TaskList
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    open={handleOpen}
                    allsub={allsub}
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
                      value={listname}
                      autoFocus
                      ref={inputref}
                      type="text"
                      placeholder="Enter list name"
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
                            setAddcard(false);
                          } else {
                            inputref.current.placeholder =
                              "Please enter list name";
                          }
                        }}
                      >
                        Add list
                      </button>
                      <button onClick={() => setAddcard(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
      {open && (
        <div
          className={style.taskdetail}
          id="taskdetail"
          onClick={(e) => {
            if (e.target.id === "taskdetail") {
              handleOpen();
            }
          }}
        >
          <TaskItem
            taskID={state.taskID}
            id={state.id}
            name={state.name}
            state={state.state}
            open={handleOpen}
          />
        </div>
      )}
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
      {showallusers && (
        <div className={style.allList}>
          <AlluserList
            projectid={projectId}
            member={memberNum}
            showmember={handleAddmember}
          />
        </div>
      )}
      {membershow && (
        <div className={style.memberList}>
          <MemberList
            projectid={projectId}
            member={memberNum}
            showmember={handlemember}
          />
        </div>
      )}
      {showdelete && (
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
                placeholder="Please enter project ID"
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
                    deleteProject(projectId);
                  }}
                >
                  Delete
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
