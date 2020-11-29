import React, { useState, useEffect } from "react";
import Header from "../head/header";
import TaskList from "./task/taskList";
import { addList } from "../../action/action";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { useDispatch } from "react-redux";

const Project = () => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  let project = firestore.collection("projects").doc(projectId);
  let [name, setName] = useState("");
  let [listname, setListName] = useState("");
  let [memberNum, setMemberNum] = useState(0);
  let [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log("now in project");
    project.onSnapshot(function (doc) {
      let data = doc.data();
      setName(data.name);
      setMemberNum(data.member.length);
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
  return (
    <div>
      <Header name={name} />
      <div>
        <button>成員項目</button>
        <button>期限</button>
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
          <button>{memberNum}</button>
          <button>加member</button>
        </div>
      </div>
      <div>
        {tasks.map((item) => (
          <TaskList key={item.id} id={item.id} name={item.name} />
        ))}
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
  );
};

export default Project;
