import React, { useState, useEffect } from "react";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import TaskItem from "../Task/taskItem";
import Loading from "../loading";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Project = (prop) => {
  // console.log(prop)
  let dispatch = useDispatch();
  let { projectId } = useParams();
  const state = useSelector((state) => state.HandleTaskMember);
  let project = firestore.collection("projects").doc(projectId);
  let [userID, setUserID] = useState("aaa");
  let [load, setLoad] = useState(true);
  let [open, setOpen] = useState(false);
  let [name, setName] = useState("");
  let [listname, setListName] = useState("");
  let [memberNum, setMemberNum] = useState([]);
  let [tasks, setTasks] = useState([]);
  let [membershow, setMemberShow] = useState(false);
  let [showallusers, setAllusers] = useState(false);

  useEffect(() => {
    let user = auth.currentUser;
    if (user) {
      // console.log(userID)
      setUserID(user.uid);
    }
    project.onSnapshot(function (doc) {
      // console.log(doc.data())
      if (doc.data() !== undefined) {
        let data = doc.data();
        setName(data.name);
        let list = [];
        data.member.forEach((item) => {
          list.push(item);
        });
        setMemberNum(list);
      }
    });
    project
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // console.log(userID)
    setTimeout(() => setLoad(false), 1000);
  }, [userID]);
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
    // console.log(result)
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
    if (dropStart === dropEnd) {
      console.log(result);
    }
  };

  return (
    <div className={style.project}>
      <Header name={name} user={userID} />
      <div className={style.nav}>
        <nav>
          <button>成員項目</button>
          <button>甘特圖</button>
          <button>績效</button>
        </nav>
        <div>
          <select name="" id="">
            <option value="進行中">進行中</option>
          </select>
          <input type="text" />
          <button>search</button>
        </div>
        <div>
          <button>權限</button>
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
            <MemberList
              projectid={projectId}
              member={memberNum}
              showmember={handlemember}
            />
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
            <AlluserList
              projectid={projectId}
              member={memberNum}
              showmember={handleAddmember}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={style.projectlist}>
        <DragDropContext onDragEnd={handleDrag}>
          {tasks.map((item) => (
            <TaskList id={item.id} name={item.name} open={handleOpen} />
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
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
};

export default Project;
