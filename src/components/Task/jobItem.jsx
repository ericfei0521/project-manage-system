import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import firebase from "firebase/app";
import EditDatePicker from "./editDayPicker";
import Comment from "./comment";
import style from "../../style/jobItem.module.scss";
import arrow from "../../images/ICON/arrow.svg";
const JobItem = (prop) => {
  let subtaskPath = firestore
    .collection("subtasks")
    .doc(prop.subtaskId)
    .collection("jobs")
    .doc(prop.jobid);
  let [isEdit, setIsEdit] = useState(false);
  let [taskName, setTaskName] = useState(prop.name);
  let [edittaskName, setEditTaskName] = useState(false);
  let [state, setState] = useState(prop.state);
  let [editstate, setEditState] = useState(false);
  let [membername, setMemberName] = useState(prop.member);
  let [membershow, setMemberShow] = useState(false);
  let [member, setMember] = useState([]);
  let [showComment, setShowcomment] = useState(false);

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
    console.log(value);
    subtaskPath.update({
      dueDate: value,
    });
  };
  const removeJob = () => {
    let path = firestore.collection("comment").where("jobID", "==", prop.jobid);
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
    subtaskPath.delete();
  };
  return (
    <div
      className={style.jobCard}
      style={
        prop.isDragging
          ? { backgroundColor: "rgba(255, 224, 137, 1)" }
          : { backgroundColor: " rgba(70, 70, 70, 1)" }
      }
    >
      <div className={style.jobitem}>
        {edittaskName ? (
          <input
            type="text"
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              handletask(e);
            }}
          />
        ) : (
          <div
            onClick={() => setEditTaskName(!edittaskName)}
            className={style.jobname}
          >
            {taskName}
          </div>
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
          <option value="Running">Running</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Rejected">Rejected</option>
          <option value="Complete">Complete</option>
        </select>

        {membershow ? (
          <div>
            {member.map((item) => (
              <button
                key={item.userID}
                value={item.displayName}
                id={item.userID}
                onClick={(e) => {
                  updateMember(e.target.value);
                  setMemberName(e.target.value);
                  updateMemberID(e.target.id);
                  setMemberShow(!membershow);
                }}
              >
                {item.displayName}
              </button>
            ))}
          </div>
        ) : (
          <div
            className={style.memberName}
            onClick={() => setMemberShow(!membershow)}
          >
            {membername}
          </div>
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
        <button
          className={style.commentshow}
          onClick={() => setShowcomment(!showComment)}
        >
          <img src={arrow} alt="" />
        </button>
      </div>
      {showComment ? (
        <Comment
          projectID={prop.projectId}
          subTaskID={prop.subtaskId}
          jobID={prop.jobid}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default JobItem;
