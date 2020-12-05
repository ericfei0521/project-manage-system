import React, { useState, useEffect } from "react";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import TaskItem from "../Task/taskItem";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link } from "react-router-dom";
import { firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Project = () => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  const state = useSelector((state) => state.HandleTaskMember);
  let project = firestore.collection("projects").doc(projectId);
  let [open, setOpen] = useState(state.open);
  let [name, setName] = useState("");
  let [listname, setListName] = useState("");
  let [memberNum, setMemberNum] = useState([]);
  let [tasks, setTasks] = useState([]);
  let [membershow, setMemberShow] = useState(false);
  let [showallusers, setAllusers] = useState(false);

  useEffect(() => {
    console.log("now in project");
    project.onSnapshot(function (doc) {
      console.log(doc.data());
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

  const handlemember = () => {
    setMemberShow(!membershow);
  };
  const handleAddmember = () => {
    setAllusers(!showallusers);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <Header name={name} />
      <div>
        <button>成員項目</button>
        <button>甘特圖</button>
        <button>績效</button>
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
      <div className={style.project}>
        {tasks.map((item) => (
          <TaskList id={item.id} name={item.name} open={handleOpen} />
        ))}
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              minHeight: "100vh",
              backgroundColor: "black",
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
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Project;
