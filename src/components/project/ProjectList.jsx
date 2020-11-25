import React from "react";
import { auth } from "../../firebase";

function ProjectList(prop) {
  console.log(prop);
  return (
    <div>
      <div>
        <h1>123</h1>
        <button onClick={() => auth.signOut()}>signout</button>
      </div>
    </div>
  );
}

export default ProjectList;
