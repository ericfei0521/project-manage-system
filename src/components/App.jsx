import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./login";
import Signup from "./signup";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
    </Switch>
  );
}

export default App;
