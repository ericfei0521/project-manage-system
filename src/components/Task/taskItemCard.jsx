import React, { useState, useEffect } from "react";
import style from "../../style/taskItem.module.scss";
import { showtaskitem } from "../../action/action";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebase";
import { Draggable } from "react-beautiful-dnd";

const TaskItemCard = ({ id, name, state, taskID, open, index }) => {
  let dispatch = useDispatch();
  let docPath = firestore.collection("subtasks").doc(id);
  let [taskName, setTaskName] = useState(name);
  let [taskState, setTaskState] = useState(state);
  let [image, setImage] = useState(null);

  useEffect(() => {
    docPath.onSnapshot((doc) => {
      if (doc.data() === undefined) {
        return;
      } else {
        setTaskName(doc.data().name);
        setTaskState(doc.data().state);
        setImage(doc.data().image);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(Provided) => (
        <div
          className={style.shortCard}
          {...Provided.draggableProps}
          {...Provided.dragHandleProps}
          ref={Provided.innerRef}
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
          <h2>State: {taskState}</h2>
          {image ? (
            <div
              className={style.image}
              style={{
                backgroundImage: `url(${image})`,
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskItemCard;
