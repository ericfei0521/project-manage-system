import { timestamp, firestore } from "../firebase";

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
      console.log(action.payload);
      let newState = {
        memberID: action.payload.memberID,
        id: action.payload.id,
        dueDate: action.payload.dueDate,
        member: action.payload.member,
        name: action.payload.name,
        state: action.payload.state,
        createTime: timestamp,
        comment: [],
      };
      state = newState;
      firestore
        .collection("subtasks")
        .doc(action.payload.taskid)
        .collection("jobs")
        .doc(action.payload.id)
        .set(newState);
      return state;
    }
    default:
      return state;
  }
};

export default HandleJobs;
