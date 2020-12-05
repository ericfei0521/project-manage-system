import React, { useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import DayJS from "react-dayjs";
import "react-nice-dates/build/style.css";
import style from "../../style/jobItem.module.scss";
function EditDatePicker(props) {
  const [date, setDate] = useState();
  let [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)}>
        Due date:{" "}
        {date ? (
          format(date, "yyyy/MM/dd", { locale: enGB })
        ) : (
          <DayJS format="YYYY/MM/DD">{props.dueDate}</DayJS>
        )}
      </button>
      <div className={style.date}>
        {show ? (
          <div style={{ width: "300px" }}>
            <DatePickerCalendar
              date={date}
              onDateChange={setDate}
              locale={enGB}
            />
            <button
              onClick={() => {
                setShow(!show);
                props.getDate(date.getTime());
              }}
            >
              Set Date
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default EditDatePicker;
