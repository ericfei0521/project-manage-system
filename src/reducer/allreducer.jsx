import Login from "./login";
import Signup from "./signup";
import { combineReducers } from "redux";

const allRedcuer = combineReducers({
  Login,
  Signup,
});

export default allRedcuer;
