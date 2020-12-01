import React, { useState, useEffect } from "react";
import { addJob } from "../../action/action";
import { useDispatch } from "react-redux";

const InputJob = () => {
  let dispatch = useDispatch();
  return (
    <div>
      <input type="text" />
    </div>
  );
};

export default InputJob;
