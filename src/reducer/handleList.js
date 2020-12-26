import { timestamp, firestore } from "../firebase";
import firebase from "firebase/app";
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
      firestore
        .collection("subtasks")
        .doc(state.id)
        .set({
          createTime: time,
          project: action.payload.projectid,
          name: state.name,
          state: action.payload.state,
          description: "Please enter description",
          image: "",
          listid: state.listid,
          index: newTask.length - 1,
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
      console.log(list);

      list.forEach((item) => {
        firestore
          .collection("comment")
          .where("subtaskID", "==", item)
          .get()
          .then((data) => {
            let commentlist = [];
            data.forEach((commentid) => {
              commentlist.push(commentid.ref.id);
              commentid.ref.delete();
            });
            return commentlist;
          })
          .then((commentlist) => {
            console.log(commentlist);
            commentlist.forEach((item) => {
              firestore
                .collection("users")
                .where("comment", "array-contains", item)
                .get()
                .then((doc) => {
                  doc.forEach((data) => {
                    data.ref.update({
                      comment: firebase.firestore.FieldValue.arrayRemove(item),
                    });
                  });
                });
            });
          });
      });
      firestore
        .collection("subtasks")
        .get()
        .then((doc) => {
          doc.forEach((item) => {
            if (list.includes(item.id)) {
              firestore
                .collection("subtasks")
                .doc(item.id)
                .collection("jobs")
                .get()
                .then((data) => {
                  data.forEach((job) => {
                    job.ref.delete();
                  });
                });
              firestore.collection("subtasks").doc(item.id).delete();
            }
          });
        });
      return state;
    }
    case "DElETE_PROJECT": {
      console.log(action.payload);
      let taskList = [];

      firestore
        .collection("projects")
        .doc(action.payload.projectId)
        .collection("tasks")
        .get()
        .then((doc) =>
          doc.forEach((item) => {
            item.data().task.forEach((data) => {
              taskList.push(data);
            });
          })
        )
        .then(() => {
          console.log(action.payload.projectId);
          firestore
            .collection("comment")
            .where("project", "==", action.payload.projectId)
            .get()
            .then((data) => {
              let commentList = [];
              data.forEach((comment) => {
                commentList.push(comment.ref.id);
                comment.ref.delete();
              });
              return commentList;
            })
            .then((commentList) => {
              console.log(commentList);
              commentList.forEach((item) => {
                firestore
                  .collection("users")
                  .where("comment", "array-contains", item)
                  .get()
                  .then((doc) => {
                    doc.forEach((data) => {
                      data.ref.update({
                        comment: firebase.firestore.FieldValue.arrayRemove(
                          item
                        ),
                      });
                    });
                  });
              });
            });
        })
        .then(() => {
          firestore
            .collection("subtasks")
            .get()
            .then((doc) => {
              firestore
                .collection("projects")
                .doc(action.payload.projectId)
                .collection("tasks")
                .get()
                .then((doc) => {
                  doc.forEach((item) => {
                    item.ref.delete();
                  });
                });
              firestore
                .collection("projects")
                .doc(action.payload.projectId)
                .collection("channel")
                .get()
                .then((doc) => {
                  doc.forEach((item) => {
                    item.ref.delete();
                  });
                });
              firestore
                .collection("projects")
                .doc(action.payload.projectId)
                .delete();
              doc.forEach((item) => {
                if (taskList.includes(item.id)) {
                  firestore
                    .collection("subtasks")
                    .doc(item.id)
                    .collection("jobs")
                    .get()
                    .then((task) => {
                      task.forEach((data) => {
                        data.ref.delete();
                      });
                    });
                  firestore.collection("subtasks").doc(item.id).delete();
                }
              });
            });
        });
      return action.payload;
    }
    default:
      return state;
  }
};

export default HandleList;
