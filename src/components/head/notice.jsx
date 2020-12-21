import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import style from "../../style/notice.module.scss";
const Notice = (prop) => {
  let [projectName, setProjectName] = useState("");
  let [taskName, setTaskName] = useState("");
  let [jobName, setJobName] = useState("");
  useEffect(() => {
    firestore
      .collection("projects")
      .doc(prop.data.project)
      .get()
      .then((doc) => {
        setProjectName(doc.data().name);
      });
    firestore
      .collection("subtasks")
      .doc(prop.data.subtaskID)
      .get()
      .then((doc) => {
        if (doc.data() !== undefined) {
          setTaskName(doc.data().name);
        }
      });
    firestore
      .collection("subtasks")
      .doc(prop.data.subtaskID)
      .collection("jobs")
      .doc(prop.data.jobID)
      .get()
      .then((doc) => {
        if (doc.data() !== undefined) {
          setJobName(doc.data().name);
        }
      });
  });
  return (
    <div className={style.card}>
      <div className={style.title}>
        <div className={style.titlehead}>
          <h1>Project: {projectName}</h1>
          <button onClick={() => prop.read(prop.data.id)}>
            <h2>X</h2>
          </button>
        </div>
        <div className={style.subTitle}>
          <h2>Card: {taskName}</h2>
          <h3>Task: {jobName}</h3>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.name}>
          <h1>{prop.data.name} :</h1>
        </div>
        <p>{prop.data.content}</p>
      </div>
    </div>
  );
};
export default Notice;
