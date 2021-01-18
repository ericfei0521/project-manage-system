import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
// import Landing from './Landing';
// import Login from './Login';
// import Signup from './SignUp';
// import Projects from './Project/Projects';
// import ProjectDetail from './Project/Project';
import { usercheck } from "../action/action";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import Loading from "./Loading";
import "../style/Reset.css";

const Landing = lazy(() => import("./Landing"));
const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./SignUp"));
const Projects = lazy(() => import("./Project/Projects"));
const ProjectDetail = lazy(() => import("./Project/Project"));
const Nomatch = lazy(() => import("./Nomatch"));
function App() {
  const dispatch = useDispatch();
  auth.onAuthStateChanged((userAuth) => {
    if (userAuth) {
      dispatch(usercheck(userAuth.uid));
    }
  });
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/projects" component={Projects} />
        <Route path="/projects/:projectId" component={ProjectDetail} />
        <Route component={Nomatch} />
      </Switch>
    </Suspense>
  );
}

export default App;
