import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import style from "../../style/userTasks.module.scss";
const MemberTasks = () => {
  const user = useSelector((state) => state.UserCheck);
  const [usertasks, setUserTasks] = useState([]);
  const [userName, setUsername] = useState("");
  const [state, setState] = useState(false);
  useEffect(() => {
    firestore
      .collection("users")
      .doc(user)
      .get()
      .then((doc) => {
        setUsername(doc.data().displayName);
      });

    const unsubscribe = firestore
      .collection("subtasks")
      .orderBy("createTime", "desc")
      .onSnapshot((doc) => {
        const newlist = [];
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
          const newarray = [...newlist];
          setUserTasks(newarray);
        });
      });
    return () => {
      unsubscribe();
    };
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
          <h2>{data.projectName}</h2>
          <h2>{data.subTaskName}</h2>
          <h2>{data.name}</h2>
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
            <Moment format="YY/MM/DD">{data.dueDate}</Moment>
          </h2>
        </div>
      ))}
    </div>
  );
};
export default MemberTasks;
