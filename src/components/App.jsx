import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./login";
import Signup from "./signup";
import ProjectList from "./project/ProjectList.jsx";
import Project from "./project/project";
import "../style/Reset.css";

function App() {
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
