import React from "react";

const TaskList = ({ name, state }) => {
  return (
    <div>
      {name}
      <button>+</button>
    </div>
  );
};
export default TaskList;
