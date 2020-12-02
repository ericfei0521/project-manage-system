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
        state: action.payload.state,
        description: "Please Enter Description",
      });
      return state;
    }
    case "EDIT_TASKS": {
      console.log(state);
      state = action.payload;
      firestore.collection("subtasks").doc(action.payload.taskid).update({
        name: action.payload.name,
        description: action.payload.description,
      });
      return state;
    }
    case "DElETE_TASKS": {
      console.log(action.payload);
      firestore
        .collection("projects")
        .doc(action.payload.projectId)
        .collection("tasks")
        .doc(action.payload.id)
        .delete();
      let list = [];
      action.payload.task.forEach((item) => {
        list.push(item.id);
      });
      firestore
        .collection("subtasks")
        .get()
        .then((doc) => {
          doc.forEach((item) => {
            if (list.includes(item.id)) {
              firestore.collection("subtasks").doc(item.id).delete();
            }
          });
        });
      return state;
    }
    default:
      return state;
  }
};

export default HandleList;
