import React from "react";
import style from "../style/loading.module.scss";

const Loading = () => {
  return (
    <div className={style.loading}>
      <div className={style.ldsellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Loading;
