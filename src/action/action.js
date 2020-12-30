import { timestamp, firestore } from "../firebase";

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
export function deleteTask(value) {
  return {
    type: "DElETE_TASKS",
    payload: value,
  };
}
export function deleteProject(value) {
  return {
    type: "DElETE_PROJECT",
    payload: value,
  };
}
export function addJob(value) {
  return {
    type: "ADD_JOBS",
    payload: value,
  };
}

export function showtaskitem(value) {
  return {
    type: "SHOW_TASKITEM",
    payload: value,
  };
}
export function usercheck(value) {
  return {
    type: "USER_CHECK",
    payload: value,
  };
}
export function showMember(value) {
  return {
    type: "SHOW",
    payload: value,
  };
}
export function preaddJobe(value) {
  return (dispatch) => {
    firestore
      .collection("subtasks")
      .doc(value.taskid)
      .collection("jobs")
      .get()
      .then((doc) => {
        const temp = [];
        doc.forEach((item) => {
          temp.push(item.data);
        });
        return temp;
      })
      .then((list) => {
        const index = list.length;
        return index;
      })
      .then((index) => {
        const newState = {
          Index: index,
          memberID: value.memberID,
          subtaskId: value.taskid,
          projectId: value.projectId,
          id: value.id,
          dueDate: value.dueDate,
          member: value.member,
          name: value.name,
          state: value.state,
          createTime: timestamp,
          projectName: value.projectName,
          subTaskName: value.subTaskName,
          comment: [],
        };
        dispatch({
          type: "ADD_JOBS",
          payload: newState,
        });
      });
  };
}
export function getMember(value) {
  return (dispatch) => {
    const list = [];
    const memberName = [];
    firestore
      .collection("users")
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          list.push(item.data());
        });
      })
      .then(() => {
        list.forEach((item) => {
          value.member.forEach((user) => {
            if (user === item.userID) {
              memberName.push(item);
            }
          });
        });
      })
      .then(() => {
        const newList = {
          show: !value.show,
          member: memberName,
          allusers: list,
        };
        dispatch({
          type: "SHOW",
          payload: newList,
        });
      });
  };
}
