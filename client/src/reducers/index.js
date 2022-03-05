import { combineReducers } from "redux";
import alert from "./alert";
import authReducer from "./authReducer";
import profile from "./profile";

export default combineReducers({
  alert,
  authReducer,
  profile,
});
