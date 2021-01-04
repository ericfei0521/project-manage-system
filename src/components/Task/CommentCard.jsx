import React, { useState, useEffect } from "react";
import style from "../../style/comment.module.scss";
import { firestore } from "../../firebase";
import { updateDoc, updateSubDoc } from "../../utils/util";
const CommentCards = (prop) => {
  const [edit, setEdit] = useState(false);
  const [send, setSend] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setNewContent] = useState(prop.data.content);
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

  const deleteContent = () => {
    updateSubDoc(
      "subtasks",
      prop.data.subtaskID,
      "jobs",
      prop.data.jobID,
      "arrayDeleteItem",
      "comment",
      prop.data.id
    );
    updateDoc(
      "users",
      prop.taskmember,
      "arrayDeleteItem",
      "comment",
      prop.data.id
    );
    firestore.collection("comment").doc(prop.data.id).delete();
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
                  updateDoc(
                    "comment",
                    prop.data.id,
                    "updateItem",
                    "content",
                    content
                  );
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
            {prop.data.name === prop.user && (
              <div onClick={() => setEdit(!edit)} className={style.editbtns}>
                <div className={style.circle}></div>
                <div className={style.circle}></div>
                <div className={style.circle}></div>
              </div>
            )}
            {edit && (
              <div className={style.controlbtns}>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => deleteContent()}>Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CommentCards;
