import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { auth, firestore, timestamp } from "../../firebase";
import { nanoid } from "nanoid";
import CommentCards from "./commentCard";
import style from "../../style/comment.module.scss";

const Comment = ({ subTaskID, jobID, projectID }) => {
  let filePath = firestore.collection("subtasks").doc(subTaskID);
  let [comment, setComment] = useState([]);
  let [jobComment, setJobcomment] = useState([]);
  let [user, setUser] = useState(null);
  let [newComment, setNewComment] = useState([]);
  let [member, setMember] = useState("");

  useEffect(() => {
    let commentid = [];
    let user = auth.currentUser;
    if (user) {
      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then((item) => {
          setUser(item.data().displayName);
        });
    }
    let unsubscribejobs = filePath
      .collection("jobs")
      .doc(jobID)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
          commentid = doc.data().comment;
          setMember(doc.data().memberID);
          setJobcomment(commentid);
        }
      });
    let unsubscribecomment = firestore
      .collection("comment")
      .orderBy("time")
      .onSnapshot((doc) => {
        let comments = [];
        doc.forEach((item) => {
          if (commentid.includes(item.id)) {
            comments.push(item.data());
          }
        });
        console.log(comments);
        setComment(comments);
      });
    return () => {
      unsubscribejobs();
      unsubscribecomment();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComment = (value) => {
    console.log(value);
    let newComments = [...comment, value];
    let jobComments = [...jobComment, value.id];
    console.log(jobComments);
    setComment(newComments);
    filePath.collection("jobs").doc(jobID).update({
      comment: jobComments,
    });
    firestore.collection("comment").doc(value.id).set(value);
    firestore
      .collection("users")
      .doc(member)
      .update({
        comment: firebase.firestore.FieldValue.arrayUnion(value.id),
      });
  };

  return (
    <div className={style.comment}>
      <div>
        {comment.map((item) => (
          <CommentCards
            user={user}
            key={item.id}
            data={item}
            taskmember={member}
          />
        ))}
      </div>
      <div>
        <textarea
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={() => {
            let time = timestamp;
            let data = {
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
          submit
        </button>
      </div>
    </div>
  );
};

export default Comment;
