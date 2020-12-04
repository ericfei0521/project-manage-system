import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { firestore } from "../../firebase";
import EditDatePicker from "./editDayPicker";
import style from "../../style/jobItem.module.scss";
const JobItem = (prop) => {
  let subtaskPath = firestore
    .collection("subtasks")
    .doc(prop.subtaskId)
    .collection("jobs")
    .doc(prop.jobid);
  let jobsPath = firestore.collection("subtasks").doc(prop.subtaskId);
  let [isEdit, setIsEdit] = useState(false);
  let [taskName, setTaskName] = useState(prop.name);
  let [edittaskName, setEditTaskName] = useState(false);
  let [state, setState] = useState(prop.state);
  let [editstate, setEditState] = useState(false);
  let [membername, setMemberName] = useState(prop.member);
  let [membershow, setMemberShow] = useState(false);
  let [member, setMember] = useState([]);
  useEffect(() => {
    let list = [];
    let memberlist = [];
    firestore
      .collection("projects")
      .doc(prop.projectId)
      .onSnapshot(function (doc) {
        if (doc.data() !== undefined) {
          list = doc.data().member;
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handletask = (e) => {
    if (e.key === "Enter") {
      setEditTaskName(!edittaskName);
      subtaskPath.update({
        name: taskName,
      });
    }
  };
  const updateDate = (value) => {
    subtaskPath.update({
      state: value,
    });
  };
  const updateMember = (value) => {
    subtaskPath.update({
      member: value,
    });
  };
  const updateMemberID = (value) => {
    subtaskPath.update({
      memberID: value,
    });
  };
  const getDate = (value) => {
    subtaskPath.update({
      dueDate: value,
    });
  };
  const removeJob = () => {
    subtaskPath.delete();
  };
  return (
    <div className={style.jobitem}>
      {edittaskName ? (
        <div className={style.item}>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              handletask(e);
            }}
          />
        </div>
      ) : (
        <h1
          onClick={() => setEditTaskName(!edittaskName)}
          className={style.item}
        >
          {taskName}
        </h1>
      )}

      <select
        name="status"
        id=""
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          setEditState(!editstate);
          updateDate(e.target.value);
        }}
      >
        <option value="On-hold">On-hold</option>
        <option value="Pending">Pending</option>
        <option value="Running">Running</option>
        <option value="Reviewing">Reviewing</option>
        <option value="Complete">Complete</option>
      </select>

      {membershow ? (
        <div>
          {member.map((item) => (
            <button
              key={item.userID}
              value={item.displayName}
              name={item.userID}
              onClick={(e) => {
                updateMember(e.target.value);
                setMemberName(e.target.value);
                updateMemberID(e.target.name);
                setMemberShow(!membershow);
              }}
            >
              {item.displayName}
            </button>
          ))}
        </div>
      ) : (
        <div onClick={() => setMemberShow(!membershow)}>{membername}</div>
      )}

      <EditDatePicker dueDate={prop.dueDate} getDate={getDate} />
      {isEdit ? (
        <div>
          <button
            onClick={() => {
              removeJob();
            }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            Back
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEdit(!isEdit)}>...</div>
      )}
    </div>
  );
};

export default JobItem;
