import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import DayJS from "react-dayjs";
import style from "../../style/userTasks.module.scss";
const MemberTasks = () => {
  const user = useSelector((state) => state.UserCheck);
  let [usertasks, setUserTasks] = useState([]);
  let [userName, setUsername] = useState("");
  let [state, setState] = useState(false);
  useEffect(() => {
    firestore
      .collection("users")
      .doc(user)
      .get()
      .then((doc) => {
        setUsername(doc.data().displayName);
      });

    firestore
      .collection("subtasks")
      .orderBy("createTime", "desc")
      .onSnapshot((doc) => {
        let newlist = [];
        doc.forEach(async (subtask) => {
          await firestore
            .collection("subtasks")
            .doc(subtask.id)
            .collection("jobs")
            .where("memberID", "==", user)
            .get()
            .then((data) => {
              data.forEach((item) => {
                newlist.push(item.data());
              });
            });
          setUserTasks(newlist);
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  useEffect(() => {
    setState(!state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={style.taskboard}>
      <h1>{userName}'s Tasks</h1>
      <div className={style.title}>
        <h2>Project</h2>
        <h2>Task</h2>
        <h2>Subtask</h2>
        <h2>State</h2>
        <h2>DueDate</h2>
      </div>
      {usertasks.map((data) => (
        <div
          key={data.id}
          className={style.taskdetail}
          style={data.state === "Complete" ? { backgroundColor: "black" } : {}}
        >
          <h2>Project {data.projectName}</h2>
          <h2>Card {data.subTaskName}</h2>
          <h2>Task {data.name}</h2>
          <h2
            style={
              data.state === "Complete"
                ? { color: "#fff8e1", fontWeight: "bold" }
                : { color: "white" }
            }
          >
            {data.state}
          </h2>
          <h2>
            <DayJS format="YYYY/MM/DD">{data.dueDate}</DayJS>
          </h2>
        </div>
      ))}
    </div>
  );
};
export default MemberTasks;
