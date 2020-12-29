// import firebase from 'firebase/app';
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
