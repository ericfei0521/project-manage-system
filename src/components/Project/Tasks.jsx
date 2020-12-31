import React, { useState, useEffect } from "react";
import TasksDetail from "./TasksDetail";
import style from "../../style/projecttasks.module.scss";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase";
import Loading from "../Loading";
const Tasks = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    const reanageList = [];
    state.member.forEach((item) => {
      const data = {
        user: item.displayName,
        userID: item.userID,
        onhold: 0,
        Rejected: 0,
        running: 0,
        reviewing: 0,
        complete: 0,
        tasks: [],
      };
      reanageList.push(data);
    });
    const unsubscribe = firestore
      .collection("subtasks")
      .where("project", "==", props.projectid)
      .onSnapshot(async (doc) => {
        const list = [];
        doc.forEach((item) => {
          list.push(
            firestore
              .collection("subtasks")
              .doc(item.id)
              .collection("jobs")
              .orderBy("createTime")
              .get()
              .then((data) => {
                const datalist = [];
                data.forEach((item) => {
                  datalist.push(item.data());
                });
                return datalist;
              })
          );
        });
        const getMemberTasks = await Promise.all(list);
        const allMemberTasks = getMemberTasks.flatMap((x) => x);

        allMemberTasks.forEach((item) => {
          for (const i in reanageList) {
            if (item.memberID === reanageList[i].userID) {
              if (item.state === "On-hold") {
                reanageList[i].onhold += 1;
              } else if (item.state === "Rejected") {
                reanageList[i].Rejected += 1;
              } else if (item.state === "Reviewing") {
                reanageList[i].reviewing += 1;
              } else if (item.state === "Running") {
                reanageList[i].running += 1;
              } else {
                reanageList[i].complete += 1;
              }
              reanageList[i].tasks.push(item);
            }
          }
        });
        setList(reanageList);
        setLoad(false);
      });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className={style.taskview}>
      {list.map((item) => (
        <TasksDetail item={item} key={item.userID} />
      ))}
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
};
export default Tasks;
