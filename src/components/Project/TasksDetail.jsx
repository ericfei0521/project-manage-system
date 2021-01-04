import React, { useState } from "react";
import Moment from "react-moment";
import style from "../../style/projecttasks.module.scss";
const TasksDetail = ({ item }) => {
  const [showdetail, setShowdetail] = useState(false);
  return (
    <div className={style.taskssummary}>
      <div
        className={style.usersummary}
        style={
          item.tasks.length === 0
            ? { backgroundColor: "black" }
            : { backgroundColor: "transparent" }
        }
      >
        <h2>{item.user}</h2>
        <div
          className={style.button}
          onClick={() => setShowdetail(!showdetail)}
        ></div>
      </div>
      <div className={`${style.tasklist} ${showdetail ? style.open : ""}`}>
        {item.tasks.map((data) => (
          <div
            className={style.tasks}
            key={data.id}
            style={
              data.state === "Complete"
                ? { backgroundColor: "rgb(30, 30, 30,0.8)" }
                : { backgroundColor: "transparent" }
            }
          >
            <div className={style.detail}>
              <h2>{data.subTaskName}</h2>
            </div>
            <div className={style.detail}>
              <h2>{data.name}</h2>
            </div>
            <div className={style.detail}>
              <h2>{data.state}</h2>
            </div>
            <div className={style.detail}>
              <h2>
                <Moment format="YY/MM/DD">{data.dueDate}</Moment>
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div
        className={style.usertasksummary}
        style={
          item.tasks.length === 0
            ? { backgroundColor: "black" }
            : { backgroundColor: "transparent" }
        }
      >
        <div className={style.state}>
          <h3>Tasks</h3>
          <h4>{item.tasks.length}</h4>
        </div>
        <div className={style.state}>
          <h3>On-hold </h3>
          <h4>{item.onhold}</h4>
        </div>
        <div className={style.state}>
          <h3>Running </h3>
          <h4>{item.running}</h4>
        </div>
        <div className={style.state}>
          <h3>Reviewing </h3>
          <h4>{item.reviewing}</h4>
        </div>
        <div className={style.state}>
          <h3>Rejected </h3>
          <h4>{item.Rejected}</h4>
        </div>
        <div className={style.state}>
          <h3>Complete </h3>
          <h4>{item.complete}</h4>
        </div>
      </div>
    </div>
  );
};
export default TasksDetail;
