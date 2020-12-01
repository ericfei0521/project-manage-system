import React, { useState, useEffect } from "react";
import DatePicker from "./dayPicker";
import { addJob } from "../../action/action";
import { useDispatch } from "react-redux";

const InputJob = ({ handleAddTask }) => {
  let dispatch = useDispatch();
  return (
    <div>
      <input type="text" />
      <select name="" id="">
        <option value="On-hold">On-hold</option>
        <option value="Pending">Pending</option>
        <option value="Running">Running</option>
        <option value="Reviewing">Reviewing</option>
        <option value="Complete">Complete</option>
      </select>
      <button>Assign Member</button>
      <DatePicker />
      <button>ADD Task</button>
      <button>Cancle</button>
    </div>
  );
};

export default InputJob;
