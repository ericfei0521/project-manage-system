import { timestamp, firestore } from "../firebase";
import firebase from "firebase/app";
const initialState = {
  id: "",
  name: "",
  task: [],
};
const HandleList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LIST": {
      state = action.payload;
      const time = timestamp;
      firestore.collection("projects").doc(state.id).collection("tasks").add({
        name: state.name,
        task: [],
        createTime: time,
      });
      return state;
    }
    case "ADD_TASKS": {
      state = action.payload;
      const time = timestamp;
      const newTask = [];
      state.oldtasks.forEach((item) => {
        newTask.push(item.id);
      });
      newTask.push(state.id);
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
      state = action.payload;
      firestore.collection("subtasks").doc(action.payload.taskid).update({
        name: action.payload.name,
        description: action.payload.description,
      });
      firestore
        .collection("subtasks")
        .doc(action.payload.taskid)
        .collection("jobs")
        .where("subtaskId", "==", action.payload.taskid)
        .get()
        .then((data) => {
          data.forEach((item) => {
            firestore
              .collection("subtasks")
              .doc(action.payload.taskid)
              .collection("jobs")
              .doc(item.id)
              .update({
                subTaskName: action.payload.name,
              });
          });
        });
      return state;
    }
    case "DElETE_TASKS": {
      firestore
        .collection("projects")
        .doc(action.payload.projectId)
        .collection("tasks")
        .doc(action.payload.id)
        .delete();
      const list = [];
      action.payload.task.forEach((item) => {
        list.push(item.id);
      });

      list.forEach((item) => {
        firestore
          .collection("comment")
          .where("subtaskID", "==", item)
          .get()
          .then((data) => {
            const commentlist = [];
            data.forEach((commentid) => {
              commentlist.push(commentid.ref.id);
              commentid.ref.delete();
            });
            return commentlist;
          })
          .then((commentlist) => {
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
      const taskList = [];
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
          firestore
            .collection("comment")
            .where("project", "==", action.payload.projectId)
            .get()
            .then((data) => {
              const commentList = [];
              data.forEach((comment) => {
                commentList.push(comment.ref.id);
                comment.ref.delete();
              });
              return commentList;
            })
            .then((commentList) => {
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
                    .collection("sub；tasks")
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
