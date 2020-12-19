import React, { useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import "../../style/restdate.css";
import style from "../../style/date.module.scss";
function DatePicker(props) {
  const [date, setDate] = useState();
  let [show, setShow] = useState(false);
  return (
    <div>
      <h1> Due date: </h1>
      <button
        onClick={() => setShow(!show)}
        className={`${style.showdate} ${show ? style.showdateOpen : ""}`}
      >
        {date ? format(date, "yyyy/MM/dd", { locale: enGB }) : "none"}
      </button>
      <div className={show ? style.datepickOpen : style.datepick}>
        <DatePickerCalendar date={date} onDateChange={setDate} locale={enGB} />
        <div className={style.buttons}>
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
    </div>
  );
}

export default DatePicker;
