import { firestore } from "../firebase";
let initail = {
  id: "",
  dueDate: "",
  member: "",
  name: "",
  state: "",
  comment: [],
};

const HandleJobs = (state = initail, action) => {
  switch (action.type) {
    case "ADD_JOBS": {
      firestore
        .collection("subtasks")
        .doc(action.payload.subtaskId)
        .collection("jobs")
        .doc(action.payload.id)
        .set(action.payload);
      return state;
    }
    default:
      return state;
  }
};

export default HandleJobs;
