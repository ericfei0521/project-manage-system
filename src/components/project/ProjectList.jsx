import React from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";

function ProjectList(prop) {
  let history = useHistory();
  const routeChange = () => {
    auth.signOut().then(function () {
      // Sign-out successful.
      history.push("/");
    });
  };
  return (
    <div>
      <div>
        <h1>123</h1>
        <button onClick={routeChange}>signout</button>
      </div>
    </div>
  );
}

export default ProjectList;
