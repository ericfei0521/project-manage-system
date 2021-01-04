import firebase from "firebase/app";
import { firestore, timestamp } from "../firebase";

export const textareaResize = (element) => {
  element.style.height = "1px";
  element.style.height = element.scrollHeight + "px";
};
export const scrollToBottom = (ref) => {
  ref.current.scrollTop = ref.current.scrollHeight;
};
export const fetchyoutube = (youtubelink, videolist, id, callBack) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = youtubelink.match(regExp);
  const urlid = match && match[7].length === 11 ? match[7] : false;
  if (youtubelink !== "" && urlid !== false) {
    const newvideolist = [...videolist, urlid];
    updateDoc("subtasks", id, "updateItem", "youtube", newvideolist).then(
      () => {
        callBack();
      }
    );
  } else {
    alert("Please enter correct youtube link");
  }
};
// update firebase doc value under first collection
export const updateDoc = (collection, docID, method, key, value) => {
  const keyname = key;
  const path = firestore.collection(collection).doc(docID);
  if (method === "arrayAddItem") {
    return path.update({
      [keyname]: firebase.firestore.FieldValue.arrayUnion(value),
    });
  } else if (method === "updateItem") {
    return path.update({
      [keyname]: value,
    });
  } else if (method === "arrayDeleteItem") {
    return path.update({
      [keyname]: firebase.firestore.FieldValue.arrayRemove(value),
    });
  }
};
export const updateSubDoc = (
  collection,
  docID,
  subCollection,
  subDocID,
  method,
  key,
  value
) => {
  const keyname = key;
  const path = firestore
    .collection(collection)
    .doc(docID)
    .collection(subCollection)
    .doc(subDocID);
  if (method === "updateItem") {
    return path.update({
      [keyname]: value,
    });
  } else if (method === "arrayDeleteItem") {
    return path.update({
      [keyname]: firebase.firestore.FieldValue.arrayRemove(value),
    });
  }
};
export const addProject = (newProjectName, newProjectState, user) => {
  if (newProjectName) {
    firestore
      .collection("projects")
      .add({
        member: [user],
        name: newProjectName,
        state: newProjectState,
        time: timestamp,
      })
      .then((docRef) => {
        const time = Date.now();
        firestore
          .collection("projects")
          .doc(docRef.id)
          .collection("channel")
          .add({
            text: `Welcome to ${newProjectName} channel`,
            time: time,
            from: "system",
          });
      });
  } else {
    alert("Please enter project name");
  }
};
const deleteSubCollectDoc = async (collection, docID, subcollection) => {
  const doc = await firestore
    .collection(collection)
    .doc(docID)
    .collection(subcollection)
    .get();
  doc.forEach((item) => {
    item.ref.delete();
  });
};
export const deleteProject = (value) => {
  const taskList = [];
  firestore
    .collection("projects")
    .doc(value)
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
        .where("project", "==", value)
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
                    comment: firebase.firestore.FieldValue.arrayRemove(item),
                  });
                });
              });
          });
        });
    })
    .then(() => {
      deleteSubCollectDoc("projects", value, "tasks");
      deleteSubCollectDoc("projects", value, "channel");
      firestore.collection("projects").doc(value).delete();
      firestore
        .collection("subtasks")
        .get()
        .then((doc) => {
          doc.forEach((item) => {
            if (taskList.includes(item.id)) {
              deleteSubCollectDoc("subtasks", item.id, "jobs");
              firestore.collection("subtasks").doc(item.id).delete();
            }
          });
        });
    });
};
