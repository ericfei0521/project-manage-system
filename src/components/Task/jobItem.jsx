import React, { useState } from "react";
import DayJS from "react-dayjs";

const JobItem = (prop) => {
  let date = prop.startDate.toDate().toDateString();
  let duedate = prop.dueDate.toDate().toDateString();
  let [starttime, setStartTime] = useState(date);
  let [duetime, setDueTime] = useState(date);
  return (
    <div>
      <h1>{prop.name}</h1>
      <h1>{prop.member}</h1>
      <h1>{prop.state}</h1>
      <h1>
        Start: <DayJS format="YYYY/MM/DD">{starttime}</DayJS>
      </h1>
      <h1>
        Due: <DayJS format="YYYY/MM/DD">{duetime}</DayJS>
      </h1>
    </div>
  );
};

export default JobItem;
