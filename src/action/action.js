export function login(value) {
  return {
    type: "LOG_IN",
    payload: value,
  };
}
export function signup(value) {
  return {
    type: "SIGN_UP",
    payload: value,
  };
}
export function addList(value) {
  return {
    type: "ADD_LIST",
    payload: value,
  };
}
export function addTasks(value) {
  return {
    type: "ADD_TASKS",
    payload: value,
  };
}
export function editTask(value) {
  return {
    type: "EDIT_TASKS",
    payload: value,
  };
}
