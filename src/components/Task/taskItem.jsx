import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import JobItem from "./jobItem";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { nanoid } from "nanoid";
import { editTask } from "../../action/action";

const TaskItem = ({ id, name, state }) => {
  let dispatch = useDispatch();
  let [editeCard, setEditCard] = useState(false);
  let [taskName, setTaskName] = useState(name);
  let [editTaskName, setEditTaskName] = useState(false);
  let [discript, setDiscript] = useState("Please Enter Description");
  let [editdiscript, setEditdiscript] = useState(false);
  let [subTask, setSubTask] = useState([]);
  useEffect(() => {
    firestore
      .collection("subtasks")
      .doc(id)
      .onSnapshot((doc) => {
        setTaskName(doc.data().name);
        setDiscript(doc.data().description);
      });
    firestore
      .collection("subtasks")
      .doc(id)
      .collection("tasks")
      .onSnapshot((doc) => {
        let childTask = [];
        doc.forEach((item) => {
          let data = {
            id: item.id,
            name: item.data().name,
            member: item.data().member,
            startdate: item.data().startDate,
            duedate: item.data().dueDate,
            state: item.data().state,
          };
          childTask.push(data);
        });
        setSubTask(childTask);
      });
  }, []);
  const handletask = (e) => {
    if (e.key === "Enter") {
      setEditTaskName(false);
      setEditdiscript(false);
      dispatch(
        editTask({
          taskid: id,
          name: taskName,
          description: discript,
        })
      );
    }
  };
  return (
    <div>
      <div className={style.shortCard} onClick={() => setEditCard(true)}>
        <h1>{taskName}</h1>
        <h1>{state}</h1>
      </div>
      <div className={editeCard ? style.opencard : style.close}>
        <div className={style.card}>
          <div>
            {editTaskName ? (
              <div>
                <input
                  type="text"
                  onChange={(e) => setTaskName(e.target.value)}
                  value={taskName}
                  onKeyDown={(e) => {
                    handletask(e);
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => {
                  setEditTaskName(true);
                }}
              >
                Task: {taskName} id:{id}
              </div>
            )}
            <button onClick={() => setEditCard(false)}>X</button>
          </div>
          <div>
            {editdiscript ? (
              <div>
                <input
                  type="text"
                  onChange={(e) => setDiscript(e.target.value)}
                  value={discript}
                  onKeyDown={(e) => handletask(e)}
                />
                <button onClick={(e) => setEditdiscript(false)}>X</button>
              </div>
            ) : (
              <div onClick={() => setEditdiscript(true)}>
                <h1>{discript}</h1>
              </div>
            )}
          </div>
          <div>
            {subTask.map((item) => (
              <JobItem
                key={item.id}
                name={item.name}
                id={item.id}
                member={item.member}
                state={item.state}
                startDate={item.startdate}
              />
            ))}
            <button>Add Task</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
