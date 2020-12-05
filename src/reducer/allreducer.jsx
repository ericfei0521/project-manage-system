import Login from "./login";
import Signup from "./signup";
import HandleList from "./handleList";
import HandleJobs from "./handleJobs";
import Handleshowmember from "./showmember";
import HandleTaskMember from "./handleTaskItem";
import { combineReducers } from "redux";

const allRedcuer = combineReducers({
  Login,
  Signup,
  HandleList,
  HandleJobs,
  Handleshowmember,
  HandleTaskMember,
});

export default allRedcuer;
