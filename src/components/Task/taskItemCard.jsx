import React from "react";
import style from "../../style/taskItem.module.scss";
import { showtaskitem } from "../../action/action";
import { useDispatch } from "react-redux";

import { Draggable } from "react-beautiful-dnd";

const TaskItemCard = ({ id, name, state, taskID, open, index, image }) => {
  let dispatch = useDispatch();
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
          <h1>{name}</h1>
          <h2>{state}</h2>
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
