import React, { useState, useEffect } from "react";
import Barchart from "./chart.js/bar";
import Piechart from "./chart.js/pie";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase";
import Loading from "../loading";
import style from "../../style/performance.module.scss";
const Performance = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  let [list, setList] = useState([]);
  let [chartinfo, setchartinfo] = useState({});
  let [taskslist, setTaskList] = useState([]);
  let [load, setLoad] = useState(true);
  console.log(state);
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
        let taskName = [];
        doc.forEach((item) => {
          let subtaskdata = {
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
                let datalist = [];
                data.forEach((item) => {
                  datalist.push(item.data());
                });
                return datalist;
              })
          );
        });
        setTaskList(taskName);
        let a = await Promise.all(list);
        let dataflatArray = a.flatMap((x) => x);
        let chartdata = {
          totaltasks: dataflatArray.length,
          onhold: [],
          rejected: [],
          reviewing: [],
          running: [],
          complete: [],
        };
        dataflatArray.forEach((item) => {
          for (let i in reanageList) {
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
      {chartinfo ? (
        <Piechart
          name={props.name}
          datas={chartinfo}
          tasklist={taskslist}
          list={list}
        />
      ) : (
        <></>
      )}

      <Barchart data={chartinfo} tasklist={taskslist} list={list} />
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
};
export default Performance;
