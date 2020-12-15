import React, { useState, useEffect } from "react";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import Tasks from "./Tasks";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import TaskItem from "../Task/taskItem";
import Loading from "../loading";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link, useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

const Project = () => {
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
  let [membershow, setMemberShow] = useState(false);
  let [showallusers, setAllusers] = useState(false);
  let [currentPage, setCurrentPage] = useState("all");

  useEffect(() => {
    let unsubscribemember = project.onSnapshot(function (doc) {
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
            tasks: item.data().task,
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
    // console.log(userID)
    setTimeout(() => setLoad(false), 100);
  }, [name]);
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
  console.log(tasks);
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
          <button onClick={() => setCurrentPage("all")}>All list</button>
          <button
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
          <button>performance</button>
        </nav>
        <div>
          <button
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
            +{memberNum.length}
          </button>
          {membershow ? (
            <div className={style.memberList}>
              <MemberList
                projectid={projectId}
                member={memberNum}
                showmember={handlemember}
              />{" "}
            </div>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              console.log(membershow);
              dispatch(
                getMember({
                  show: membershow,
                  member: memberNum,
                })
              );
              setAllusers(!showallusers);
            }}
          >
            + member
          </button>
          <Link to="/projects">
            <button
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
          {showallusers ? (
            <div className={style.alluser}>
              <AlluserList
                projectid={projectId}
                member={memberNum}
                showmember={handleAddmember}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {currentPage === "tasks" ? (
        <Tasks projectid={projectId} member={memberNum} />
      ) : (
        <></>
      )}
      {currentPage === "all" ? (
        <div className={style.projectlist}>
          <DragDropContext onDragEnd={handleDrag}>
            {tasks.map((item) => (
              <TaskList
                key={item.id}
                id={item.id}
                name={item.name}
                open={handleOpen}
              />
            ))}
          </DragDropContext>
          <div>
            <input
              onChange={(e) => setListName(e.target.value)}
              value={listname}
              type="text"
              placeholder="Task Name"
            />
            <button
              onClick={() => {
                dispatch(
                  addList({
                    id: projectId,
                    name: listname,
                  })
                );
                setListName("");
              }}
            >
              +
            </button>
          </div>
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
    </div>
  );
};

export default Project;
