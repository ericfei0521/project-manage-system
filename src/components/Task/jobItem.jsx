import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase";
import firebase from "firebase/app";
import Comment from "./comment";
import style from "../../style/jobItem.module.scss";
import arrow from "../../images/ICON/arrow.svg";
import arrowleft from "../../images/ICON/arrowleft.svg";
import arrowright from "../../images/ICON/arrowright.svg";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import Moment from "react-moment";
import "../../style/restdate.css";
import "react-nice-dates/build/style.css";

const JobItem = (prop) => {
  const scrolldiv = useRef(null);
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
  let [openJob, setOpenJob] = useState(false);
  const [date, setDate] = useState();
  let [show, setShow] = useState(false);

  useEffect(() => {
    let list = [];
    let memberlist = [];
    let unsubscribemember = firestore
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
    return () => {
      unsubscribemember();
    };
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
  const scrollleft = () => {
    scrolldiv.current.scrollLeft -= 150;
  };
  const scrollright = () => {
    scrolldiv.current.scrollLeft += 150;
  };
  console.log(document.body.taskItem);
  return (
    <div className={style.jobCard}>
      <div
        className={`${style.jobitem} ${prop.isDragging ? style.ondrag : ""}${
          openJob ? style.jobitemOpen : ""
        }`}
      >
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
        <div
          className={style.memberName}
          onClick={() => {
            setMemberShow(!membershow);
          }}
        >
          <h1 onClick={() => setOpenJob(!openJob)}>{membername}</h1>
        </div>
        {membershow ? (
          <div className={style.members}>
            <button className={style.controler} onClick={() => scrollleft()}>
              <img src={arrowleft} alt="" />
            </button>
            <div className={style.memberlist} ref={scrolldiv}>
              {member.map((item) => (
                <button
                  className={style.memberCard}
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

            <button className={style.controler} onClick={() => scrollright()}>
              <img src={arrowright} alt="" />
            </button>
          </div>
        ) : (
          <></>
        )}
        <button onClick={() => setShow(!show)} className={style.editDate}>
          <h1> Due date:</h1>
          {date ? (
            format(date, "yyyy/MM/dd", { locale: enGB })
          ) : (
            <Moment format="YYYY/MM/DD">{prop.dueDate}</Moment>
          )}
        </button>
        {show ? (
          <div className={style.date}>
            <DatePickerCalendar
              date={date}
              onDateChange={setDate}
              locale={enGB}
            />
            <button
              onClick={() => {
                setShow(!show);
                getDate(date.getTime());
              }}
            >
              Set Date
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className={style.btns}>
          <button
            className={style.commentshow}
            onClick={() => setShowcomment(!showComment)}
          >
            <img src={arrow} alt="" />
          </button>
          <button
            className={isEdit ? style.opendelete : style.delete}
            onClick={() => {
              removeJob();
            }}
          >
            Delete
          </button>
          <div
            className={`${style.opencontrol} ${
              isEdit ? "" : style.closecontrol
            }`}
            onClick={() => setIsEdit(!isEdit)}
          ></div>
        </div>
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
