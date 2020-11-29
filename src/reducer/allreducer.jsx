import Login from "./login";
import Signup from "./signup";
import HandleList from "./addList";
import { combineReducers } from "redux";

const allRedcuer = combineReducers({
  Login,
  Signup,
  HandleList,
});

export default allRedcuer;
