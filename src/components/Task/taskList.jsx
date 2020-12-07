import React, { useState, useEffect } from "react";
import { addTasks, deleteTask } from "../../action/action";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { nanoid } from "nanoid";
import style from "../../style/taskList.module.scss";
import TaskItemCard from "./taskItemCard";
import { Droppable } from "react-beautiful-dnd";

const TaskList = ({ name, id, open }) => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  let [nowTask, setTask] = useState([]);
  let [subTaskname, setsubTaskName] = useState("");
  let [listName, setListName] = useState(name);
  let [substate, setsubTaskState] = useState("on-hold");
  let [nameEdit, setNameEdit] = useState(false);
  let [removeTask, setRemoveTask] = useState(false);
  let [isEdit, setEdit] = useState(false);
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
      if (doc.data() !== undefined) {
        let updateData = [];
        let list = doc.data().task;
        console.log(list);
        dataList
          .orderBy("createTime")
          .get()
          .then(function (doc) {
            list.forEach((item) => {
              doc.forEach((task) => {
                if (task.id === item) {
                  let data = {
                    id: task.id,
                    name: task.data().name,
                    state: task.data().state,
                  };
                  updateData.push(data);
                }
              });
            });
            setTask(updateData);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const keyEvent = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") {
        setNameEdit(!nameEdit);
        return;
      }
      setNameEdit(!nameEdit);
      taskList.update({
        name: e.target.value,
      });
    }
  };
  return (
    <div className={style.list}>
      <div className={style.listDetail}>
        {nameEdit ? (
          <div>
            <input
              autoFocus
              type="text"
              onChange={(e) => setListName(e.target.value)}
              onKeyDown={(e) => keyEvent(e)}
            />
          </div>
        ) : (
          <h1 onClick={() => setNameEdit(!nameEdit)}>{listName}</h1>
        )}
        {removeTask ? (
          <div>
            <button
              onClick={() =>
                dispatch(
                  deleteTask({
                    projectId: projectId,
                    task: nowTask,
                    id: id,
                  })
                )
              }
            >
              Delete
            </button>
            <button onClick={() => setRemoveTask(!removeTask)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setRemoveTask(!removeTask)}>...</button>
        )}
      </div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Droppable droppableId={id}>
            {(Provided) => (
              <div
                {...Provided.droppableProps}
                ref={Provided.innerRef}
                style={{ padding: "1px", flexGrow: 1 }}
              >
                {nowTask.map((item, index) => (
                  <TaskItemCard
                    index={index}
                    taskID={id}
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    state={item.state}
                    open={open}
                  />
                ))}
                {Provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        {isEdit ? (
          <div>
            <input
              onChange={(e) => setsubTaskName(e.target.value)}
              value={subTaskname}
              type="text"
              placeholder="Task Name"
            />
            <select
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
                if (substate === "") {
                  substate = "on-hold";
                }
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
                setEdit(false);
              }}
            >
              Add Task
            </button>
            <button onClick={() => setEdit(false)}>X</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setEdit(true)}>Add Task</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskList;
