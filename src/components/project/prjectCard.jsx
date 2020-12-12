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
        <h1>{name}</h1>
        <h2>state:{state}</h2>
      </Link>
    </div>
  );
};

export default PrjectCard;
