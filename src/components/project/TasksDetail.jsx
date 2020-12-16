import React, { useState } from "react";
import DayJS from "react-dayjs";
import style from "../../style/projecttasks.module.scss";
const TasksDetail = ({ item }) => {
  let [showdetail, setShowdetail] = useState(false);
  return (
    <div className={style.taskssummary}>
      <div className={style.usersummary}>
        <h2>{item.user}</h2>
        <h2>Task: {item.tasks.length}</h2>
        <div className={style.state}>
          <h3>On-hold: </h3>
          <h4>{item.onhold}</h4>
        </div>
        <div className={style.state}>
          <h3>Running: </h3>
          <h4>{item.running}</h4>
        </div>
        <div className={style.state}>
          <h3>Reviewing: </h3>
          <h4>{item.reviewing}</h4>
        </div>
        <div className={style.state}>
          <h3>Rejected: </h3>
          <h4>{item.Rejected}</h4>
        </div>
        <div className={style.state}>
          <h3>Complete: </h3>
          <h4>{item.complete}</h4>
        </div>
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
                ? { backgroundColor: "rgb(80, 80, 80)" }
                : { backgroundColor: "transparent" }
            }
          >
            <div className={style.detail}>
              <h2>Task:</h2>
              <h2>{data.subTaskName}</h2>
            </div>
            <div className={style.detail}>
              <h2>SubTask:</h2>
              <h2>{data.name}</h2>
            </div>
            <div className={style.detail}>
              <h2>Status</h2>
              <h2>{data.state}</h2>
            </div>
            <div className={style.detail}>
              <h2>Due Date</h2>
              <h2>
                <DayJS format="YYYY/MM/DD">{data.dueDate}</DayJS>
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TasksDetail;
