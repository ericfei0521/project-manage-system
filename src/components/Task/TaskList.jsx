import React, { useState } from "react";
import { addTasks, deleteTask } from "../../action/action";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { nanoid } from "nanoid";
import style from "../../style/taskList.module.scss";
import TaskItemCard from "./TaskItemCard";
import { Droppable } from "react-beautiful-dnd";

const TaskList = ({ name, id, open, allsub }) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [subTaskname, setsubTaskName] = useState("");
  const [listName, setListName] = useState(name);
  const [substate, setsubTaskState] = useState("on-hold");
  const [nameEdit, setNameEdit] = useState(false);
  const [removeTask, setRemoveTask] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const taskList = firestore
    .collection("projects")
    .doc(projectId)
    .collection("tasks")
    .doc(id);

  let nowTask = [];
  allsub.forEach((data) => {
    if (data.listid === id) {
      const dataitem = {
        id: data.id,
        name: data.name,
        state: data.state,
        index: data.index,
        image: data.image,
      };
      nowTask.push(dataitem);
    }
  });
  nowTask = nowTask.sort((a, b) => {
    return a.index - b.index;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyEvent = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
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
  const textareaResize = (element) => {
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };
  return (
    <div className={style.list}>
      <div className={style.listDetail}>
        {nameEdit ? (
          <textarea
            autoFocus
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onFocus={(e) => textareaResize(e.target)}
            onKeyDown={(e) => {
              keyEvent(e);
              textareaResize(e.target);
            }}
          ></textarea>
        ) : (
          <div
            className={style.listname}
            onClick={() => setNameEdit(!nameEdit)}
          >
            {listName}
          </div>
        )}
        {removeTask ? (
          <div className={style.editname}>
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
          <button
            className={style.editbutton}
            onClick={() => setRemoveTask(!removeTask)}
          >
            <div></div>
            <div></div>
            <div></div>
          </button>
        )}
      </div>
      <div className={style.displayzone}>
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
                    image={item.image}
                  />
                ))}
                {Provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        {isEdit ? (
          <div className={style.addtaskinfo}>
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
              <option value="Running">Running</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Complete">Complete</option>
            </select>
            <div className={style.addbutton}>
              <button
                onClick={() => {
                  if (substate === "") {
                    setsubTaskState("on-hold");
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
              <button onClick={() => setEdit(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className={style.addtasks} onClick={() => setEdit(true)}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
};
export default TaskList;
