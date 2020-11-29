import React from "react";
import { Link } from "react-router-dom";

const PrjectCard = ({ id, name, state }) => {
  return (
    <Link
      to={{
        pathname: `/projects/${id}`,
      }}
      className="brand-logo"
    >
      <div display="flex">
        <h1>
          {name} state:{state}
        </h1>
      </div>
    </Link>
  );
};

export default PrjectCard;
