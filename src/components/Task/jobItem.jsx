import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import EditDatePicker from "./editDayPicker";

const JobItem = (prop) => {
  console.log(prop);
  let subtaskPath = firestore
    .collection("subtasks")
    .doc(prop.subtaskId)
    .collection("jobs")
    .doc(prop.jobid);
  let userTaskkPath = firestore
    .collection("users")
    .doc(prop.memberID)
    .collection("jobs");
  let [isEdit, setIsEdit] = useState(false);
  let [taskName, setTaskName] = useState(prop.name);
  let [edittaskName, setEditTaskName] = useState(false);
  let [state, setState] = useState(prop.state);
  let [editstate, setEditState] = useState(false);
  let [statechange, setStatechange] = useState(false);
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
        list = doc.data().member;
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
        console.log(memberlist);
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
  return (
    <div>
      <input
        type="checkbox"
        onChange={() => {
          setStatechange(!statechange);
        }}
        checked={statechange ? true : false}
      />
      {edittaskName ? (
        <div>
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
        <h1 onClick={() => setEditTaskName(!edittaskName)}>{taskName}</h1>
      )}

      {editstate ? (
        <select
          name="status"
          id=""
          value={statechange ? "Complete" : state}
          onChange={(e) => {
            setState(e.target.value);
            setEditState(!editstate);
            updateDate(e.target.value);
            if (e.target.value === "Complete") {
              setStatechange(true);
            } else {
              setStatechange(false);
            }
          }}
        >
          <option value="On-hold">On-hold</option>
          <option value="Pending">Pending</option>
          <option value="Running">Running</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Complete">Complete</option>
        </select>
      ) : (
        <div onClick={() => setEditState(!editstate)}>
          {statechange ? "Complete" : state}
        </div>
      )}

      {membershow ? (
        <select
          name=""
          id=""
          value={membername}
          onChange={(e) => {
            setMemberName(e.target.value);
            setMemberShow(!membershow);
          }}
        >
          {member.map((item) => (
            <option
              value={item.displayName}
              name={item.userID}
              onClick={(e) => {
                updateMember(e.target.value);
                console.log(e.target.name);
                setMemberShow(!membershow);
              }}
            >
              {item.displayName}
            </option>
          ))}
        </select>
      ) : (
        <div onClick={() => setMemberShow(!membershow)}>{membername}</div>
      )}

      <EditDatePicker dueDate={prop.dueDate} />
      {isEdit ? (
        <div>
          <button onClick={() => setIsEdit(!isEdit)}>Delete</button>
        </div>
      ) : (
        <div onClick={() => setIsEdit(!isEdit)}>...</div>
      )}
    </div>
  );
};

export default JobItem;
