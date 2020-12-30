import React from "react";
import { Switch, Route } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./SignUp";
import Projects from "./Project/Projects";
import ProjectDetail from "./Project/Project";
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
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/projects" component={Projects} />
      <Route path="/projects/:projectId" component={ProjectDetail} />
    </Switch>
  );
}

export default App;
