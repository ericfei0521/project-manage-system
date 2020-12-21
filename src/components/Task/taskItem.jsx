import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import JobItem from "./jobItem";
import InputJob from "./inputJob";
import ImageDropper from "./imageDropper";
import firebase from "firebase/app";
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
  let [sidebar, setSidebar] = useState(false);
  let [image, setImage] = useState("");
  let [openupload, setUpload] = useState(false);
  useEffect(() => {
    let unsubscribesubtasks = docPath.onSnapshot((doc) => {
      console.log(doc.data());
      if (doc.data() !== undefined) {
        setTaskName(doc.data().name);
        setDiscript(doc.data().description);
        setTaskState(doc.data().state);
      }
    });
    let unsubscribeimage = firestore
      .collection("subtasks")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
          setImage(doc.data().image);
        }
        console.log(doc.data.image);
      });
    let unsubscribejobs = docPath
      .collection("jobs")
      .orderBy("Index")
      .onSnapshot((doc) => {
        if (doc) {
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
        }
      });
    console.log("aaa");
    return () => {
      unsubscribesubtasks();
      unsubscribejobs();
      unsubscribeimage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handletask = () => {
    setEditdiscript(false);
    dispatch(
      editTask({
        taskid: id,
        name: taskName,
        description: discript,
      })
    );
  };
  const handletaskname = (e) => {
    if (e.key === "Enter") {
      if (taskName !== "") {
        setEditTaskName(false);
        dispatch(
          editTask({
            taskid: id,
            name: taskName,
            description: discript,
          })
        );
      }
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
    let path = firestore.collection("comment").where("subtaskID", "==", id);
    let userpath = firestore.collection("users");
    path
      .get()
      .then((doc) => {
        let commentList = [];
        doc.forEach((item) => {
          commentList.push(item.ref.id);
          item.ref.delete();
        });
        return commentList;
      })
      .then((commentlist) => {
        commentlist.forEach((item) => {
          userpath
            .where("comment", "array-contains", item)
            .get()
            .then((doc) => {
              doc.forEach((data) => {
                data.ref.update({
                  comment: firebase.firestore.FieldValue.arrayRemove(item),
                });
              });
            });
        });
      });
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
    firestore
      .collection("subtasks")
      .doc(id)
      .collection("jobs")
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          item.ref.delete();
        });
      });
    firestore.collection("subtasks").doc(id).delete();
    open();
  };

  const handleDrag = (result) => {
    console.log(result);
    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }
    const item = Array.from(subTask);
    const [reorderItem] = item.splice(result.source.index, 1);
    item.splice(result.destination.index, 0, reorderItem);
    let batch = firestore.batch();
    for (let i = 0; i < item.length; i++) {
      let path = firestore
        .collection("subtasks")
        .doc(id)
        .collection("jobs")
        .doc(item[i].id);
      batch.update(path, { Index: i });
    }
    batch.commit();
    setSubTask(item);
  };
  const textareaResize = (element) => {
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };
  const handleupload = () => {
    setUpload(false);
  };
  return (
    <div>
      <div className={style.card}>
        <div className={style.head}>
          <div className={style.headTitle}>
            {editTaskName ? (
              <textarea
                autoFocus
                onFocus={(e) => textareaResize(e.target)}
                name=""
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={(e) => {
                  handletaskname(e);
                  textareaResize(e.target);
                }}
              ></textarea>
            ) : (
              <h1
                onClick={() => {
                  setEditTaskName(true);
                }}
              >
                {taskName}
              </h1>
            )}
            <div className={style.controler}>
              <button onClick={() => open()}>X</button>
            </div>
          </div>
          <div className={style.Status}>
            <h2>Status:</h2>
            <select
              onChange={(e) => {
                setTaskState(e.target.value);
                handleTaskState(e.target.value);
              }}
              value={taskState}
              className={`${style.inComplete} ${
                taskState === "Complete" ? style.Complete : ""
              }`}
            >
              <option value="On-hold">On-hold</option>
              <option value="Running">Running</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>
        {editdiscript ? (
          <div
            className={style.discriptContent}
            style={sidebar ? { zIndex: "10" } : { zIndex: "300" }}
          >
            <textarea
              autoFocus
              type="text"
              onChange={(e) => setDiscript(e.target.value)}
              value={discript}
              onFocus={(e) => textareaResize(e.target)}
              onKeyDown={(e) => {
                textareaResize(e.target);
              }}
            />
            <div className={style.disbuttons}>
              <button
                onClick={(e) => {
                  setEditdiscript(false);
                  handletask();
                }}
              >
                Save
              </button>
              <button onClick={(e) => setEditdiscript(false)}>back</button>
            </div>
          </div>
        ) : (
          <h1
            className={style.discriptContent}
            onClick={() => setEditdiscript(true)}
          >
            {discript}
          </h1>
        )}
        <ImageDropper
          id={id}
          image={image}
          openupload={openupload}
          handleupload={handleupload}
        />
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId={id}>
            {(Provided) => (
              <div
                {...Provided.droppableProps}
                ref={Provided.innerRef}
                className={style.jobarea}
              >
                {subTask.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(Provided, snapshot) => (
                        <div
                          {...Provided.draggableProps}
                          {...Provided.dragHandleProps}
                          ref={Provided.innerRef}
                          className={snapshot.isDragging ? style.jobs : ""}
                        >
                          <JobItem
                            isDragging={snapshot.isDragging}
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

        <div
          className={style.moremenu}
          style={
            sidebar
              ? { zIndex: "15", transition: "z-index .2s" }
              : { zIndex: 0, transition: "z-index 1s" }
          }
        >
          <div
            className={`${style.menu} ${sidebar ? "" : style.menuopen}`}
            onClick={() => setSidebar(!sidebar)}
          >
            <h1>more</h1>
          </div>
          <div
            className={`${style.sidebar} ${sidebar ? "" : style.sidebaropen}`}
          >
            <button
              className={style.addtask}
              onClick={() => {
                setAddSubTask(!addsubTask);
                setSidebar(false);
              }}
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setSidebar(false);
                setUpload(!openupload);
              }}
            >
              {image ? "Update Image" : "Add Image"}
            </button>
            <button
              onClick={() => {
                setSidebar(false);
              }}
            >
              Attach Link
            </button>
            <button onClick={() => deleteTask()}>Delete</button>
          </div>
        </div>
      </div>
      {addsubTask ? (
        <div className={style.inputjob}>
          <InputJob
            projectId={projectId}
            handleAddTask={handleAddTask}
            subTaskID={id}
          />{" "}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TaskItem;
