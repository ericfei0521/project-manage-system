import React from "react";
import style from "../../style/comment.module.scss";
const CommentCards = (prop) => {
  console.log(prop);
  return (
    <div className={style.commentCard}>
      <div className={style.content}>
        <div className={style.user}>
          <h1>{prop.data.name.charAt(0)}</h1>
        </div>
        <div className={style.content}>
          <h1>{prop.data.name}</h1>
          <p>{prop.data.content}</p>
        </div>
      </div>
      <div>
        <button>...</button>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};
export default CommentCards;
