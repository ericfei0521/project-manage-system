import React, { useState, useEffect } from "react";
import DatePicker from "./dayPicker";
import { nanoid } from "nanoid";
import { firestore } from "../../firebase";
import { preaddJobe } from "../../action/action";
import { useDispatch } from "react-redux";

const InputJob = ({ handleAddTask, projectId, subTaskID }) => {
  console.log(subTaskID);
  let dispatch = useDispatch();
  let [member, setMember] = useState([]);
  let [showmember, setShowmember] = useState(false);
  let [taskmember, setTaskmember] = useState("");
  let [taskmemberID, setTaskmemberID] = useState("");
  let [status, setStatus] = useState("On-hold");
  let [date, setDate] = useState("");
  let [taskname, setTaskName] = useState("");
  useEffect(() => {
    let list = [];
    let memberlist = [];
    firestore
      .collection("projects")
      .doc(projectId)
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
  console.log(status);
  const getDate = (value) => {
    setDate(value);
  };
  return (
    <div>
      <input type="text" onChange={(e) => setTaskName(e.target.value)} />
      <select
        name="status"
        id=""
        onChange={(e) => {
          setStatus(e.target.value);
        }}
      >
        <option value="On-hold" selected>
          On-hold
        </option>
        <option value="Pending">Pending</option>
        <option value="Running">Running</option>
        <option value="Reviewing">Reviewing</option>
        <option value="Complete">Complete</option>
      </select>
      <button onClick={() => setShowmember(!showmember)}>
        {taskmember ? taskmember : "Assign Member"}
      </button>
      {showmember ? (
        <div>
          {member.map((item) => (
            <button
              key={item.userID}
              onClick={() => {
                setShowmember(!showmember);
                setTaskmember(item.displayName);
                setTaskmemberID(item.userID);
              }}
            >
              {item.displayName} {item.email}{" "}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
      <DatePicker getDate={getDate} />
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
        ADD Task
      </button>
      <button onClick={() => handleAddTask()}>Cancle</button>
    </div>
  );
};

export default InputJob;
