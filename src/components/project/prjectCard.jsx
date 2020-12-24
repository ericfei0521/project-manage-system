import React from "react";
import { Link } from "react-router-dom";
import style from "../../style/projectCard.module.scss";
const PrjectCard = ({ id, name, state }) => {
  return (
    <div display="flex" className={style.projectCard}>
      <Link
        to={{
          pathname: `/projects/${id}`,
        }}
      >
        <div className={style.header}>
          {/* <h1>Project :</h1> */}
          <h1>{name}</h1>
        </div>
        <span>{state}</span>
      </Link>
    </div>
  );
};

export default PrjectCard;
