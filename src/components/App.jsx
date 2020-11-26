import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./login";
import Signup from "./signup";
import ProjectList from "./project/ProjectList";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/project" component={ProjectList} />
    </Switch>
  );
}

export default App;
