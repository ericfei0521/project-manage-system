import { timestamp, firestore } from "../firebase";
import firebase from "firebase/app";
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
        subtaskId: action.payload.taskid,
        projectId: action.payload.projectId,
        id: action.payload.id,
        dueDate: action.payload.dueDate,
        member: action.payload.member,
        name: action.payload.name,
        state: action.payload.state,
        createTime: timestamp,
        comment: [],
      };
      let newjobs = {
        dueDate: action.payload.dueDate,
        id: action.payload.id,
        member: action.payload.member,
        memberID: action.payload.memberID,
        name: action.payload.name,
        state: action.payload.state,
      };
      state = newState;
      firestore
        .collection("subtasks")
        .doc(action.payload.taskid)
        .collection("jobs")
        .doc(action.payload.id)
        .set(newState);
      firestore
        .collection("subtasks")
        .doc(action.payload.taskid)
        .update({
          jobs: firebase.firestore.FieldValue.arrayUnion(newjobs),
        });
      return state;
    }
    default:
      return state;
  }
};

export default HandleJobs;
