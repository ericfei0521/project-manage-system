import React, { useState, useEffect } from "react";
// import { useSelector } from 'react-redux'
import { firestore } from "../../firebase";

const Tasks = (props) => {
  //   const state = useSelector((state) => state.Handleshowmember)
  let [list, setList] = useState([]);
  useEffect(() => {
    // let reanageList = []
    let datalist = [];
    // state.member.forEach((item) => {
    //   let data = {
    //     user: item.displayName,
    //     userID: item.userID,
    //     tasks: [],
    //   }
    //   reanageList.push(data)
    // })
    firestore
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
                data.forEach((item) => {
                  datalist.push(item.data());
                });
                return datalist;
              })
          );
        });
        console.log(list);
        let a = await Promise.all(list);
        let c = a[0];
        c.sort((a, b) => (a.memberID > b.memberID ? 1 : -1));
        setList(c);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(list);
  return (
    <div>
      {list.map((item) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h1>{item.member}</h1>
          <h1>{item.projectName}</h1>
          <h1>{item.subTaskName}</h1>
          <h1>{item.name}</h1>
        </div>
      ))}
    </div>
  );
};
export default Tasks;
