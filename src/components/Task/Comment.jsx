import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import { auth, firestore, timestamp } from "../../firebase";
import { nanoid } from "nanoid";
import CommentCards from "./CommentCard";
import send from "../../images/ICON/submit.png";
import style from "../../style/comment.module.scss";

const Comment = ({ subTaskID, jobID, projectID }) => {
  const divRref = useRef(null);
  const filePath = firestore.collection("subtasks").doc(subTaskID);
  const [comment, setComment] = useState([]);
  const [jobComment, setJobcomment] = useState([]);
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState([]);
  const [member, setMember] = useState("");
  const [currentuserid, setCurrentid] = useState("");
  useEffect(() => {
    let commentid = [];
    const user = auth.currentUser;
    if (user) {
      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then((item) => {
          setCurrentid(user.uid);
          setUser(item.data().displayName);
        });
    }
    const unsubscribejobs = filePath
      .collection("jobs")
      .doc(jobID)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
          commentid = doc.data().comment;
          setMember(doc.data().memberID);
          setJobcomment(commentid);
        }
      });
    const unsubscribecomment = firestore
      .collection("comment")
      .orderBy("time")
      .onSnapshot((doc) => {
        const comments = [];
        doc.forEach((item) => {
          if (commentid.includes(item.id)) {
            comments.push(item.data());
          }
        });
        setComment(comments);
      });

    return () => {
      unsubscribejobs();
      unsubscribecomment();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [comment]);
  const handleComment = (value) => {
    const newComments = [...comment, value];
    const jobComments = [...jobComment, value.id];
    setComment(newComments);
    filePath.collection("jobs").doc(jobID).update({
      comment: jobComments,
    });
    firestore.collection("comment").doc(value.id).set(value);
    if (currentuserid !== member) {
      firestore
        .collection("users")
        .doc(member)
        .update({
          comment: firebase.firestore.FieldValue.arrayUnion(value.id),
        });
    }
  };
  const textareaResize = (element) => {
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };
  const scrollToBottom = () => {
    divRref.current.scrollTop = divRref.current.scrollHeight;
  };
  return (
    <div className={style.comment}>
      <div className={style.comments} ref={divRref}>
        {comment.map((item) => (
          <CommentCards
            user={user}
            key={item.id}
            data={item}
            taskmember={member}
          />
        ))}
      </div>
      <div className={style.typearea}>
        <div className={style.blank}></div>
        <textarea
          type="text"
          value={newComment}
          onKeyDown={(e) => textareaResize(e.target)}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
        <button
          onClick={() => {
            const time = timestamp;
            const data = {
              name: user,
              project: projectID,
              subtaskID: subTaskID,
              jobID: jobID,
              id: nanoid(),
              content: newComment,
              time: time,
            };
            handleComment(data);
            setNewComment("");
          }}
        >
          <img src={send} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Comment;
