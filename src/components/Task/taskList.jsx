import React, { useState, useEffect } from "react";
import { addTasks } from "../../action/action";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { nanoid } from "nanoid";

const TaskList = ({ name, id }) => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  let [nowTask, setTask] = useState([]);
  let [subTaskname, setsubTaskName] = useState("");
  let [substate, setsubTaskState] = useState("");
  //   project內的tasklist
  let taskList = firestore
    .collection("projects")
    .doc(projectId)
    .collection("tasks")
    .doc(id);
  //   subtasks內的id
  let dataList = firestore.collection("subtasks");
  // 核對兩者是否有相等
  useEffect(() => {
    taskList.onSnapshot(function (doc) {
      if (!doc.data().task) {
        return;
      }
      let updateData = [];
      let list = doc.data().task;
      dataList
        .orderBy("createTime")
        .get()
        .then(function (doc) {
          doc.forEach((item) => {
            if (list.includes(item.id)) {
              let data = {
                id: item.id,
                name: item.data().name,
                state: item.data().state,
              };
              updateData.push(data);
            }
          });
          // console.log(updateData)
          setTask(updateData);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {name}
      {nowTask.map((item) => (
        <h1 key={item.id}>
          task: {item.name} <br /> state:{item.state}
        </h1>
      ))}
      <input
        onChange={(e) => setsubTaskName(e.target.value)}
        value={subTaskname}
        type="text"
        placeholder="Task Name"
      />
      <select
        name=""
        id=""
        onChange={(e) => setsubTaskState(e.target.value)}
        value={substate}
      >
        <option value="On-hold">On-hold</option>
        <option value="Pending">Pending</option>
        <option value="Running">Running</option>
        <option value="Reviewing">Reviewing</option>
        <option value="Complete">Complete</option>
      </select>
      <button
        onClick={() => {
          dispatch(
            addTasks({
              oldtasks: nowTask,
              projectid: projectId,
              listid: id,
              id: nanoid(),
              name: subTaskname,
              state: substate,
            })
          );
          setsubTaskName("");
          setsubTaskState("");
        }}
      >
        +
      </button>
    </div>
  );
};
export default TaskList;
