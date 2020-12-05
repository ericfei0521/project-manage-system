import React, { useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import style from "../../style/date.module.scss";
import "../../style/test.css";
function DatePicker(props) {
  const [date, setDate] = useState();
  let [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)}>
        Due date: {date ? format(date, "yyyy/MM/dd", { locale: enGB }) : "none"}
      </button>
      {show ? (
        <div className={style.background}>
          <DatePickerCalendar
            date={date}
            onDateChange={setDate}
            locale={enGB}
          />
          <div>
            <button
              onClick={() => {
                setShow(!show);
                props.getDate(date.getTime());
              }}
            >
              Set Date
            </button>
            <button
              onClick={() => {
                setShow(!show);
              }}
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DatePicker;
