import React, { useState } from "react";

const JobItem = (prop) => {
  let date = prop.startDate.toDate().toDateString();
  let [time, setTime] = useState(date);
  return (
    <div>
      <h1>{prop.name}</h1>
      <h1>{prop.member}</h1>
      <h1>{prop.state}</h1>
      <h1>{time}</h1>
    </div>
  );
};

export default JobItem;
