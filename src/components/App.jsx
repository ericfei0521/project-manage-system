import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./Login";
import Signup from "./signup";
import ProjectList from "./Project/ProjectList.jsx";
import Project from "./Project/Project";
import "../style/Reset.css";
import { usercheck } from "../action/action";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";

function App() {
  const dispatch = useDispatch();
  auth.onAuthStateChanged((userAuth) => {
    if (userAuth) {
      dispatch(usercheck(userAuth.uid));
    }
  });
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/projects" component={ProjectList} />
      <Route path="/projects/:projectId" component={Project} />
    </Switch>
  );
}

export default App;
