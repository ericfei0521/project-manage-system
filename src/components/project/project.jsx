import React, { useState, useEffect } from "react";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link } from "react-router-dom";
import { firestore } from "../../firebase";
import { useDispatch } from "react-redux";

const Project = () => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  let project = firestore.collection("projects").doc(projectId);
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
          <TaskList key={item.id} id={item.id} name={item.name} />
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
      </div>
    </div>
  );
};

export default Project;
