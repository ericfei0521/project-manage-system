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

    default:
      return state;
  }
};

export default HandleList;
