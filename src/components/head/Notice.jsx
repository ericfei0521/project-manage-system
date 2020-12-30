import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import style from "../../style/notice.module.scss";
import { commentReadUpdate } from "../../utils/util";

const Notice = (prop) => {
  const subtaskPath = firestore.collection("subtasks").doc(prop.data.subtaskID);
  const [projectName, setProjectName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [jobName, setJobName] = useState("");
  useEffect(() => {
    const unsubscribenames = firestore
      .collection("projects")
      .doc(prop.data.project)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
          setProjectName(doc.data().name);
        }
      });
    const unsubscribetask = subtaskPath.onSnapshot((doc) => {
      if (doc.data() !== undefined) {
        setTaskName(doc.data().name);
      }
    });
    const unsubscribejobs = subtaskPath
      .collection("jobs")
      .doc(prop.data.jobID)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
          setJobName(doc.data().name);
        }
      });
    return () => {
      unsubscribenames();
      unsubscribetask();
      unsubscribejobs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={style.card}>
      <div className={style.title}>
        <div className={style.titlehead}>
          <h1>{projectName}</h1>
          <button
            onClick={() => commentReadUpdate(false, prop.user, prop.data.id)}
          >
            <h2>X</h2>
          </button>
        </div>
        <div className={style.subTitle}>
          <h2>{taskName}/</h2>
          <h3>{jobName}</h3>
        </div>
      </div>
      <div className={style.content}>
        <h1>{prop.data.name} :</h1>
        <p>{prop.data.content}</p>
      </div>
    </div>
  );
};
export default Notice;
