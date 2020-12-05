import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import JobItem from "./jobItem";
import InputJob from "./inputJob";
import ImageDropper from "./imageDropper";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { editTask } from "../../action/action";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskItem = ({ id, name, state, taskID, open }) => {
  let dispatch = useDispatch();
  let docPath = firestore.collection("subtasks").doc(id);
  let { projectId } = useParams();
  let [taskName, setTaskName] = useState(name);
  let [taskState, setTaskState] = useState(state);
  let [editTaskName, setEditTaskName] = useState(false);
  let [discript, setDiscript] = useState("Please Enter Description");
  let [editdiscript, setEditdiscript] = useState(false);
  let [subTask, setSubTask] = useState([]);
  let [addsubTask, setAddSubTask] = useState(false);
  useEffect(() => {
    console.log(id);
    docPath.onSnapshot((doc) => {
      if (doc.data() === undefined) {
        return;
      } else {
        setTaskName(doc.data().name);
        setDiscript(doc.data().description);
        setTaskState(doc.data().state);
      }
    });
    docPath
      .collection("jobs")
      .orderBy("Index")
      .onSnapshot((doc) => {
        let childTask = [];
        doc.forEach((item) => {
          let data = {
            id: item.id,
            memberID: item.data().memberID,
            name: item.data().name,
            member: item.data().member,
            dueDate: item.data().dueDate,
            state: item.data().state,
            comment: item.data().comment,
          };
          childTask.push(data);
        });
        setSubTask(childTask);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleAddTask = () => {
    setAddSubTask(false);
  };
  const handleTaskState = (value) => {
    firestore.collection("subtasks").doc(id).update({
      state: value,
    });
  };
  const deleteTask = () => {
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskID)
      .get()
      .then((doc) => {
        let data = [];
        doc.data().task.forEach((item) => {
          if (item !== id) {
            data.push(item);
          }
        });
        return data;
      })
      .then((data) => {
        firestore
          .collection("projects")
          .doc(projectId)
          .collection("tasks")
          .doc(taskID)
          .update({
            task: data,
          });
      });
  };
  const handleDrag = (result) => {
    console.log(result);
    if (!result.destination) return;
    const item = Array.from(subTask);
    const [reorderItem] = item.splice(result.source.index, 1);
    item.splice(result.destination.index, 0, reorderItem);
    setSubTask(item);
    console.log(item);
    firestore
      .collection("subtasks")
      .doc(id)
      .collection("jobs")
      .get()
      .then((doc) => {
        doc.forEach((data) => {
          for (let i = 0; i < item.length; i++) {
            if (item[i].id === data.data().id) {
              firestore
                .collection("subtasks")
                .doc(id)
                .collection("jobs")
                .doc(item[i].id)
                .update({
                  Index: i,
                });
            }
          }
        });
      });
  };
  return (
    <div>
      <div className={style.card}>
        <div className={style.head}>
          <div className={style.headTitle}>
            {editTaskName ? (
              <input
                autoFocus
                type="text"
                onChange={(e) => setTaskName(e.target.value)}
                value={taskName}
                onKeyDown={(e) => {
                  handletask(e);
                }}
              />
            ) : (
              <h1
                onClick={() => {
                  setEditTaskName(true);
                }}
              >
                {taskName}
              </h1>
            )}
            <button onClick={() => open()}>X</button>
          </div>
          <div className={style.Status}>
            <h1>Status:</h1>
            <select
              onChange={(e) => {
                setTaskState(e.target.value);
                handleTaskState(e.target.value);
              }}
              value={taskState}
              className={
                taskState === "Complete" ? style.Complete : style.inComplete
              }
            >
              <option value="On-hold">On-hold</option>
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <button onClick={() => deleteTask()}>Delete</button>
        </div>
        <div>
          {editdiscript ? (
            <div className={style.head}>
              <textarea
                type="text"
                onChange={(e) => setDiscript(e.target.value)}
                value={discript}
                onKeyDown={(e) => handletask(e)}
              />
              <button onClick={(e) => setEditdiscript(false)}>X</button>
            </div>
          ) : (
            <div onClick={() => setEditdiscript(true)}>
              <h1 onClick={() => setEditdiscript(true)}>{discript}</h1>
            </div>
          )}
        </div>
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId="jobs">
            {(Provided) => (
              <div {...Provided.droppableProps} ref={Provided.innerRef}>
                {subTask.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(Provided) => (
                        <div
                          {...Provided.draggableProps}
                          {...Provided.dragHandleProps}
                          ref={Provided.innerRef}
                        >
                          <JobItem
                            memberID={item.memberID}
                            subtaskId={id}
                            projectId={projectId}
                            jobid={item.id}
                            name={item.name}
                            state={item.state}
                            member={item.member}
                            dueDate={item.dueDate}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {Provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {addsubTask ? (
          <InputJob
            projectId={projectId}
            handleAddTask={handleAddTask}
            subTaskID={id}
          />
        ) : (
          <button onClick={() => setAddSubTask(!addsubTask)}>Add Task</button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
