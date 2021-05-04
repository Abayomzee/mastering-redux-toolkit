import { combineReducers } from "redux";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import usersReducer from "./users";

export default combineReducers({
  projects: projectsReducer,
  bugs: bugsReducer,
  users: usersReducer,
});
