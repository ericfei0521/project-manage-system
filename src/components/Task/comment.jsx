import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../firebase";
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
    let comments = [];
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
    filePath
      .collection("jobs")
      .doc(jobID)
      .onSnapshot((doc) => {
        commentid = doc.data().comment;
        setMember(doc.data().memberID);
        setJobcomment(commentid);
      });
    filePath
      .collection("comment")
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          if (commentid.includes(item.id)) {
            comments.push(item.data());
          }
        });
        console.log(comments);
        setComment(comments);
      });
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
    filePath.collection("comment").doc(value.id).set(value);
    firestore.collection("users").doc(member).update({
      comment: jobComments,
    });
  };

  return (
    <div className={style.comment}>
      <div>
        {comment.map((item) => (
          <CommentCards user={user} key={item.id} data={item} />
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
            let data = {
              name: user,
              project: projectID,
              subtaskID: subTaskID,
              jobID: jobID,
              id: nanoid(),
              content: newComment,
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
