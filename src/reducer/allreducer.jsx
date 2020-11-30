import Login from "./login";
import Signup from "./signup";
import HandleList from "./handleList";
import HandleJobs from "./handleJobs";
import { combineReducers } from "redux";

const allRedcuer = combineReducers({
  Login,
  Signup,
  HandleList,
  HandleJobs,
});

export default allRedcuer;
