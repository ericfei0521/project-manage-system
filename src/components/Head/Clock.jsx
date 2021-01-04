import { useState, useEffect } from "react";

function Clock() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (minute < 10) {
    minute = `0` + minute;
  }
  let time = `${hour}:${minute}`;
  const [date, setDate] = useState(time);

  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    if (minute < 10) {
      minute = `0` + minute;
    }
    time = `${hour}:${minute}`;
    setDate(time);
  }

  return (
    <div style={{ color: "white", fontSize: "1.2em" }}>
      <h2>{date}</h2>
    </div>
  );
}

export default Clock;
