import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import style from "../../../style/performance.module.scss";
const Piechart = ({ datas, name }) => {
  console.log(datas);
  let [dataSet, setdataSet] = useState({});
  let [complete, setcomplete] = useState(0);
  useEffect(() => {
    if (datas.onhold) {
      let barstate = {
        labels: ["On-hold", "Running", "Reviewing", "Rejected", "Complete"],
        datasets: [
          {
            label: name,
            borderWidth: 0,
            fontSize: 5,
            hoverBorderWidth: 2,
            backgroundColor: [
              "rgb(195, 195, 195,0.8)",
              "rgb(156, 219, 126,0.8)",
              "rgb(226, 220, 132,0.8)",
              " rgb(250, 122, 105,0.8)",
              "rgb(129, 202, 235,0.8)",
            ],
            hoverBackgroundColor: [
              "rgb(195, 195, 195,1)",
              "rgb(156, 219, 126,1)",
              "rgb(226, 220, 132,1)",
              " rgb(250, 122, 105,1)",
              "rgb(129, 202, 235,1)",
            ],
            data: [
              datas.onhold.length,
              datas.running.length,
              datas.reviewing.length,
              datas.rejected.length,
              datas.complete.length,
            ],
          },
        ],
      };
      setdataSet(barstate);
    }
    if (datas.complete) {
      let completepercentage = datas.complete.length / datas.totaltasks;
      let percentage = Math.floor(completepercentage * 100);
      setcomplete(percentage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datas]);

  return (
    <div className={style.pie}>
      <div className={style.detail}>
        <h2>Progress</h2>
        <h2>{complete}%</h2>
      </div>
      <Doughnut
        data={dataSet}
        height="400"
        options={{
          cutoutPercentage: 60,
          maintainAspectRatio: false,

          title: {
            display: true,
            text: "Project Progress",
            fontSize: 20,
            fontColor: "white",
          },
          legend: {
            position: "top",
            display: false,
            labels: {
              fontColor: "white",
              fontSize: 20,
              display: true,
            },
          },
        }}
      />
    </div>
  );
};
export default Piechart;
