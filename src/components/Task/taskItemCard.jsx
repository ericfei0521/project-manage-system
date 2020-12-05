import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import { showtaskitem } from "../../action/action";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";

const TaskItemCard = ({ id, name, state, taskID, open }) => {
  let dispatch = useDispatch();
  let docPath = firestore.collection("subtasks").doc(id);
  let [taskName, setTaskName] = useState(name);
  let [taskState, setTaskState] = useState(state);

  useEffect(() => {
    console.log(id);
    docPath.onSnapshot((doc) => {
      if (doc.data() === undefined) {
        return;
      } else {
        setTaskName(doc.data().name);
        setTaskState(doc.data().state);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={style.shortCard}
      onClick={() => {
        open();
        dispatch(
          showtaskitem({
            taskID: taskID,
            id: id,
            name: name,
            state: state,
            open: true,
          })
        );
      }}
    >
      <h1>{taskName}</h1>
      <h1>{taskState}</h1>
    </div>
  );
};

export default TaskItemCard;
