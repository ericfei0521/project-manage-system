import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./login";
import Signup from "./signup";
import ProjectList from "./project/ProjectList";
import { auth } from "../firebase";

function App() {
  let [currentUser, setCurrentuser] = useState(null);
  function componentDidMount() {
    auth.onAuthStateChanged((user) => {
      setCurrentuser(user);
      console.log(currentUser);
    });
  }
  componentDidMount();
  return (
    <Switch>
      <Route exact path="/">
        {currentUser ? (
          <Redirect to="/project" user={currentUser} />
        ) : (
          <Welcome />
        )}
      </Route>
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/project" component={ProjectList} />
    </Switch>
  );
}

export default App;
