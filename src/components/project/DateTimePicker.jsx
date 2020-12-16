import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = (prop) => {
  const [startDate, setStartDate] = useState(new Date());
  let [current, setDate] = useState("");
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        setDate(date);
        prop.handleDate(date);
      }}
      showTimeSelect
      dateFormat="yyyy/MM/dd/ h:mm aa"
    />
  );
};
export default DateTimePicker;
