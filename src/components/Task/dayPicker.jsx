import React, { useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import "react-nice-dates/build/style.css";
function DatePicker(props) {
  const [date, setDate] = useState();
  let [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)}>
        Due date: {date ? format(date, "yyyy/MM/dd", { locale: enGB }) : "none"}
      </button>
      {show ? (
        <div>
          <DatePickerCalendar
            date={date}
            onDateChange={setDate}
            locale={enGB}
          />
          <button onClick={() => setShow(!show)}>Set Date</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DatePicker;
