import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import JobItem from "./jobItem";
import InputJob from "./inputJob";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { editTask } from "../../action/action";
import { useParams } from "react-router-dom";

const TaskItem = ({ id, name, state }) => {
  let dispatch = useDispatch();
  let { projectId } = useParams();
  let [editeCard, setEditCard] = useState(false);
  let [taskName, setTaskName] = useState(name);
  let [editTaskName, setEditTaskName] = useState(false);
  let [discript, setDiscript] = useState("Please Enter Description");
  let [editdiscript, setEditdiscript] = useState(false);
  let [subTask, setSubTask] = useState([]);
  let [addsubTask, setAddSubTask] = useState(false);
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
      .collection("jobs")
      .orderBy("createTime")
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
                memberID={item.memberID}
                subtaskId={id}
                projectId={projectId}
                jobid={item.id}
                name={item.name}
                state={item.state}
                member={item.member}
                dueDate={item.dueDate}
              />
            ))}
          </div>
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
    </div>
  );
};

export default TaskItem;
