import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase";
import firebase from "firebase/app";
import Comment from "./Comment";
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
import { updateSubDoc } from "../../utils/util";

const JobItem = (prop) => {
  const scrolldiv = useRef(null);
  const subtaskPath = firestore
    .collection("subtasks")
    .doc(prop.subtaskId)
    .collection("jobs")
    .doc(prop.jobid);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState(prop.name);
  const [edittaskName, setEditTaskName] = useState(false);
  const [membershow, setMemberShow] = useState(false);
  const [member, setMember] = useState([]);
  const [showComment, setShowcomment] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let list = [];
    const memberlist = [];
    const unsubscribemember = firestore
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
  const removeJob = () => {
    const path = firestore
      .collection("comment")
      .where("jobID", "==", prop.jobid);
    const userpath = firestore.collection("users");
    path
      .get()
      .then((doc) => {
        const commentList = [];
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
  const scroll = (direct) => {
    if (direct === "left") {
      scrolldiv.current.scrollLeft -= 150;
    } else if (direct === "right") {
      scrolldiv.current.scrollLeft += 150;
    }
  };
  return (
    <div className={style.jobCard}>
      <div
        className={`${style.jobitem} ${prop.isDragging && style.ondrag}${
          openJob && style.jobitemOpen
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
            {prop.name.toString().length > 10
              ? prop.name.toString().substring(0, 10) + "..."
              : prop.name.toString()}
          </div>
        )}
        <select
          name="status"
          id=""
          value={prop.state}
          onChange={(e) => {
            updateSubDoc(
              "subtasks",
              prop.subtaskId,
              "jobs",
              prop.jobid,
              "updateItem",
              "state",
              e.target.value
            );
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
          <h1 onClick={() => setOpenJob(!openJob)}>{prop.member}</h1>
        </div>
        {membershow && (
          <div className={style.members}>
            <button className={style.controler} onClick={() => scroll("left")}>
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
                    updateSubDoc(
                      "subtasks",
                      prop.subtaskId,
                      "jobs",
                      prop.jobid,
                      "updateItem",
                      "member",
                      e.target.value
                    );
                    updateSubDoc(
                      "subtasks",
                      prop.subtaskId,
                      "jobs",
                      prop.jobid,
                      "updateItem",
                      "memberID",
                      e.target.id
                    );
                    setMemberShow(!membershow);
                  }}
                >
                  {item.displayName}
                </button>
              ))}
            </div>

            <button className={style.controler} onClick={() => scroll("right")}>
              <img src={arrowright} alt="" />
            </button>
          </div>
        )}
        <button onClick={() => setShow(!show)} className={style.editDate}>
          {date ? (
            format(date, "yyyy/MM/dd", { locale: enGB })
          ) : (
            <Moment format="YY/MM/DD">{prop.dueDate}</Moment>
          )}
        </button>
        {show && (
          <div className={style.date}>
            <DatePickerCalendar
              date={date}
              onDateChange={setDate}
              locale={enGB}
            />
            <button
              onClick={() => {
                setShow(!show);
                updateSubDoc(
                  "subtasks",
                  prop.subtaskId,
                  "jobs",
                  prop.jobid,
                  "updateItem",
                  "dueDate",
                  date.getTime()
                );
              }}
            >
              Set date
            </button>
          </div>
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
            ✖
          </button>
          <div
            className={`${style.opencontrol} ${isEdit || style.closecontrol}`}
            onClick={() => setIsEdit(!isEdit)}
          ></div>
        </div>
      </div>
      {showComment && (
        <Comment
          projectID={prop.projectId}
          subTaskID={prop.subtaskId}
          jobID={prop.jobid}
          memberlist={member}
        />
      )}
    </div>
  );
};

export default JobItem;
