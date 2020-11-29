import { timestamp, firestore } from "../firebase";
let initialState = {
  id: "",
  name: "",
  task: [],
};
const HandleList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LIST": {
      state = action.payload;
      let time = timestamp;
      firestore.collection("projects").doc(state.id).collection("tasks").add({
        name: state.name,
        task: [],
        createTime: time,
      });
      return state;
    }
    case "ADD_TASKS": {
      state = action.payload;
      let time = timestamp;
      console.log(state);
      let newTask = [];
      state.oldtasks.forEach((item) => {
        newTask.push(item.id);
      });
      newTask.push(state.id);
      console.log(newTask);
      firestore
        .collection("projects")
        .doc(state.projectid)
        .collection("tasks")
        .doc(state.listid)
        .update({
          task: newTask,
        });
      firestore.collection("subtasks").doc(state.id).set({
        createTime: time,
        name: state.name,
        state: state.state,
        tasks: [],
      });
      return state;
    }
    default:
      return state;
  }
};

export default HandleList;
