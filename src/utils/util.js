import firebase from "firebase/app";
import { firestore } from "../firebase";
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
    firestore
      .collection("subtasks")
      .doc(id)
      .update({
        youtube: newvideolist,
      })
      .then(() => {
        callBack();
      });
  } else {
    alert("Please enter correct youtube link");
  }
};

export const commentReadUpdate = (readAll, userID, value) => {
  console.log(value);
  const userUpdatePath = firestore.collection("users").doc(userID);
  if (readAll === false) {
    return userUpdatePath.update({
      comment: firebase.firestore.FieldValue.arrayRemove(value),
    });
  } else {
    return userUpdatePath.update({
      comment: [],
    });
  }
};

export const updateDoc = (collection, docID, method, key, value) => {
  const keyname = key;
  if (method === "arrayAddItem") {
    return firestore
      .collection(collection)
      .doc(docID)
      .update({
        [keyname]: firebase.firestore.FieldValue.arrayUnion(value),
      });
  } else if (method === "updateItem") {
    return firestore
      .collection(collection)
      .doc(docID)
      .update({
        [keyname]: value,
      });
  } else if (method === "arrayDeleteItem") {
    return firestore
      .collection(collection)
      .doc(docID)
      .update({
        [keyname]: firebase.firestore.FieldValue.arrayRemove(value),
      });
  }
};
