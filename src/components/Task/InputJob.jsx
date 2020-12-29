import React, { useState, useEffect, useRef } from "react";
import DatePicker from "./DatePicker";
import style from "../../style/inputjob.module.scss";
import { nanoid } from "nanoid";
import { firestore } from "../../firebase";
import { preaddJobe } from "../../action/action";
import { useDispatch } from "react-redux";

const InputJob = ({ handleAddTask, projectId, subTaskID }) => {
  const membersref = useRef(null);
  const dispatch = useDispatch();
  const [member, setMember] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [subtaskName, setsubTaskName] = useState("");
  const [showmember, setShowmember] = useState(false);
  const [taskmember, setTaskmember] = useState("");
  const [taskmemberID, setTaskmemberID] = useState("");
  const [status, setStatus] = useState("On-hold");
  const [date, setDate] = useState("");
  const [taskname, setTaskName] = useState("");
  const [memberopen, setOpenmember] = useState(false);
  useEffect(() => {
    let list = [];
    const memberlist = [];
    const unsubscribeproject = firestore
      .collection("projects")
      .doc(projectId)
      .onSnapshot(function (doc) {
        if (doc.data() !== undefined) {
          setProjectName(doc.data().name);
          list = doc.data().member;
        }
      });
    const unsubsvribesubtask = firestore
      .collection("subtasks")
      .doc(subTaskID)
      .onSnapshot((doc) => {
        setsubTaskName(doc.data().name);
      });
    firestore
      .collection("users")
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          if (list.includes(item.id)) {
            memberlist.push(item.data());
          }
        });
        setMember(memberlist);
      });
    return () => {
      unsubscribeproject();
      unsubsvribesubtask();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDate = (value) => {
    setDate(value);
  };
  const resize = () => {
    membersref.current.scrollTop = 0;
  };
  return (
    <div className={style.inputjob}>
      <h1>Task Name :</h1>
      <input
        type="text"
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Please Enter Task Name"
      />
      <h1>Status :</h1>
      <select
        name="status"
        id=""
        onChange={(e) => {
          setStatus(e.target.value);
        }}
      >
        <option value="On-hold">On-hold</option>
        <option value="Running">Running</option>
        <option value="Reviewing">Reviewing</option>
        <option value="Rejected">Rejected</option>
        <option value="Complete">Complete</option>
      </select>
      <div className={style.selectmember}>
        <button onClick={() => setShowmember(!showmember)}>Member</button>
        <div
          className={`${style.selector} ${
            memberopen ? "" : style.selectorOpen
          }`}
          onClick={(e) => {
            setOpenmember(!memberopen);
            resize();
          }}
        >
          <h2>{taskmember ? taskmember : "Please Select Member"}</h2>
        </div>
        <div
          className={`${style.members} ${memberopen ? style.membersopen : ""}`}
          ref={membersref}
        >
          {member.map((item) => (
            <button
              className={style.member}
              key={item.userID}
              onClick={(e) => {
                resize();
                setOpenmember(!memberopen);
                setShowmember(!showmember);
                setTaskmember(item.displayName);
                setTaskmemberID(item.userID);
              }}
            >
              <span>{item.displayName}</span>
              <span>{item.email}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={style.date}>
        <DatePicker getDate={getDate} />
      </div>
      <div className={style.bottombtns}>
        <button
          onClick={() => {
            if (taskname && taskmember) {
              dispatch(
                preaddJobe({
                  id: nanoid(),
                  memberID: taskmemberID,
                  projectId: projectId,
                  taskid: subTaskID,
                  dueDate: date,
                  member: taskmember,
                  name: taskname,
                  state: status,
                  projectName: projectName,
                  subTaskName: subtaskName,
                  comment: [],
                })
              );
              handleAddTask();
            } else {
              alert("Please Enter taskname or assign member");
            }
            setTaskName("");
          }}
        >
          Add task
        </button>
        <button onClick={() => handleAddTask()}>Cancel</button>
      </div>
    </div>
  );
};

export default InputJob;
