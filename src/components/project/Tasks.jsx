import React, { useState, useEffect } from "react";
import TasksDetail from "./TasksDetail";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase";

const Tasks = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  let [list, setList] = useState([]);
  let [showdetail, setShowdetail] = useState(false);
  useEffect(() => {
    let reanageList = [];
    state.member.forEach((item) => {
      let data = {
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
    let unsubscribe = firestore
      .collection("subtasks")
      .where("project", "==", props.projectid)
      .onSnapshot(async (doc) => {
        let list = [];

        doc.forEach((item) => {
          list.push(
            firestore
              .collection("subtasks")
              .doc(item.id)
              .collection("jobs")
              .orderBy("createTime")
              .get()
              .then((data) => {
                let datalist = [];
                data.forEach((item) => {
                  datalist.push(item.data());
                });
                return datalist;
              })
          );
        });
        let a = await Promise.all(list);
        let dataflatArray = a.flatMap((x) => x);

        dataflatArray.forEach((item) => {
          for (let i in reanageList) {
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
      });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  console.log(list);
  return (
    <div>
      {list.map((item) => (
        <TasksDetail item={item} />
      ))}
    </div>
  );
};
export default Tasks;
