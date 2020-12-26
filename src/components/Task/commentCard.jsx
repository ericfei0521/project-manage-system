import React, { useState, useEffect } from "react";
import style from "../../style/comment.module.scss";
import firebase from "firebase/app";
import { firestore } from "../../firebase";

const CommentCards = (prop) => {
  let [edit, setEdit] = useState(false);
  let [send, setSend] = useState(false);
  let [editing, setEditing] = useState(false);
  let [content, setNewContent] = useState(prop.data.content);
  useEffect(() => {
    firestore
      .collection("comment")
      .doc(prop.data.id)
      .onSnapshot((doc) => {
        if (doc.data()) {
          setNewContent(doc.data().content);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send]);
  const editContent = (value) => {
    firestore.collection("comment").doc(prop.data.id).update({
      content: value,
    });
  };
  const deleteContent = () => {
    let path = firestore.collection("subtasks").doc(prop.data.subtaskID);
    firestore.collection("comment").doc(prop.data.id).delete();
    path
      .collection("jobs")
      .doc(prop.data.jobID)
      .update({
        comment: firebase.firestore.FieldValue.arrayRemove(prop.data.id),
      });
    firestore
      .collection("users")
      .doc(prop.taskmember)
      .update({
        comment: firebase.firestore.FieldValue.arrayRemove(prop.data.id),
      });
  };
  return (
    <div className={style.commentCard}>
      <div className={style.commends}>
        <div className={style.user}>
          <h1>{prop.data.name.toString().charAt(0)}</h1>
        </div>
        {editing ? (
          <div className={style.content}>
            <textarea
              autoFocus
              type="text"
              value={content}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className={style.checkbtns}>
              <button
                onClick={() => {
                  editContent(content);
                  setEditing(false);
                  setEdit(!edit);
                  setSend(!send);
                }}
              >
                Save
              </button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={style.content}>
            <h1>{prop.data.name}</h1>
            <p style={{ whiteSpace: "pre-line" }}>{content}</p>
            {prop.data.name === prop.user ? (
              <div onClick={() => setEdit(!edit)} className={style.editbtns}>
                <div className={style.circle}></div>
                <div className={style.circle}></div>
                <div className={style.circle}></div>
              </div>
            ) : (
              <></>
            )}
            {edit ? (
              <div className={style.controlbtns}>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => deleteContent()}>Delete</button>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CommentCards;
