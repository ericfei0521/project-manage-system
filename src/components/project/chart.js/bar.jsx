import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import style from "../../../style/performance.module.scss";
const Barchart = ({ data, tasklist }) => {
  let [dataSet, setdataSet] = useState({});

  useEffect(() => {
    let barstate = {
      labels: ["On-hold", "Running", "Reviewing", "Rejected", "Complete"],
      datasets: [],
    };
    tasklist.forEach((task) => {
      let set = {
        label: task.name,
        categoryPercentage: 1.0,
        barPercentage: 0.5,
        backgroundColor: "#fff8e1",
        hoverBorderColor: "rgba(255,99,132,1)",
        borderWidth: "3",
        data: [],
      };
      let onhold = 0;
      let running = 0;
      let reviewing = 0;
      let reject = 0;
      let complete = 0;
      data.onhold.forEach((item) => {
        if (item.subtaskId === task.id) {
          onhold += 1;
        }
      });
      set.data.push(onhold);
      data.running.forEach((item) => {
        if (item.subtaskId === task.id) {
          running += 1;
        }
      });
      set.data.push(running);
      data.reviewing.forEach((item) => {
        if (item.subtaskId === task.id) {
          reviewing += 1;
        }
      });
      set.data.push(reviewing);
      data.rejected.forEach((item) => {
        if (item.subtaskId === task.id) {
          reject += 1;
        }
      });
      set.data.push(reject);
      data.complete.forEach((item) => {
        if (item.subtaskId === task.id) {
          complete += 1;
        }
      });
      set.data.push(complete);
      barstate.datasets.push(set);
    });
    setdataSet(barstate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className={style.bar}>
      <Bar
        data={dataSet}
        options={{
          height: 500,
          title: {
            display: true,
            text: "Tasks Status",
            fontSize: 20,
            fontColor: "white",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  stepSize: 1,
                  fontColor: "white",
                },
                gridLines: {
                  color: "rgba(160, 160, 160, 0.8)",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  fontColor: "white",
                },
                gridLines: {
                  color: "rgba(160, 160, 160, 0.8)",
                },
              },
            ],
          },
          gridLines: {
            display: false,
            color: "#FFFFFF",
          },
          legend: {
            position: "left",
            display: false,
            labels: {
              fontColor: "white",
              fontSize: 13,
              display: true,
            },
          },
        }}
      />
    </div>
  );
};
export default Barchart;
