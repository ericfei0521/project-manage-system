import React, { useState, useEffect } from "react";
import Barchart from "./Chart/Bar";
import DonutChart from "./Chart/Donut";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase";
import Loading from "../loading";
import style from "../../style/performance.module.scss";
const Performance = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  const [list, setList] = useState([]);
  const [chartinfo, setchartinfo] = useState({});
  const [taskslist, setTaskList] = useState([]);
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
        const taskName = [];
        doc.forEach((item) => {
          const subtaskdata = {
            name: item.data().name,
            id: item.id,
          };
          taskName.push(subtaskdata);
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
        setTaskList(taskName);
        const a = await Promise.all(list);
        const dataflatArray = a.flatMap((x) => x);
        const chartdata = {
          totaltasks: dataflatArray.length,
          onhold: [],
          rejected: [],
          reviewing: [],
          running: [],
          complete: [],
        };
        dataflatArray.forEach((item) => {
          for (const i in reanageList) {
            if (item.memberID === reanageList[i].userID) {
              if (item.state === "On-hold") {
                reanageList[i].onhold += 1;
                chartdata.onhold.push(item);
              } else if (item.state === "Rejected") {
                reanageList[i].Rejected += 1;
                chartdata.rejected.push(item);
              } else if (item.state === "Reviewing") {
                reanageList[i].reviewing += 1;
                chartdata.reviewing.push(item);
              } else if (item.state === "Running") {
                reanageList[i].running += 1;
                chartdata.running.push(item);
              } else {
                reanageList[i].complete += 1;
                chartdata.complete.push(item);
              }
              reanageList[i].tasks.push(item);
            }
          }
        });
        setchartinfo(chartdata);
        setList(reanageList);
        setLoad(false);
      });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className={style.performance}>
      <DonutChart
        name={props.name}
        datas={chartinfo}
        tasklist={taskslist}
        list={list}
      />
      <Barchart data={chartinfo} tasklist={taskslist} list={list} />
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
};
export default Performance;
