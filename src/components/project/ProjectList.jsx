import React, { useState } from "react";
import Header from "../context/header";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";

function ProjectList() {
  let history = useHistory();
  let [userID, setUserID] = useState(null);
  let state = userID;
  auth.onAuthStateChanged(async (userAuth) => {
    if (!userAuth) {
      history.push("/");
    } else {
      setUserID(userAuth.uid);
    }
  });
  const routeChange = () => {
    auth.signOut().then(function () {
      // Sign-out successful.
      history.push("/");
    });
  };
  return (
    <div>
      <div>
        <Header />
        <h1>{state}</h1>
        <button onClick={routeChange}>signout</button>
      </div>
    </div>
  );
}
export default ProjectList;
