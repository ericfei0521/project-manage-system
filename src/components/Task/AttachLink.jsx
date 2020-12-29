import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import style from "../../style/videolink.module.scss";
const Attachlink = ({ handleattach, id }) => {
  const [youtubelink, setYoutubeLink] = useState("");
  const [videolist, setVideolist] = useState([]);

  useEffect(() => {
    firestore
      .collection("subtasks")
      .doc(id)
      .get()
      .then((item) => {
        if (item.data().youtube !== undefined) {
          setVideolist(item.data().youtube);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleattach]);
  const fetchyoutube = () => {
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
          handleattach();
        });
    } else {
      alert("Please enter correct youtube link");
    }
  };
  return (
    <div className={style.inputwrap}>
      <input
        type="text"
        onChange={(e) => setYoutubeLink(e.target.value)}
        autoFocus
        placeholder="Enter Youtube Link"
      />
      <div className={style.btns}>
        <button onClick={() => fetchyoutube()}>Attach</button>
        <button onClick={() => handleattach()}>Cancel</button>
      </div>
    </div>
  );
};
export default Attachlink;
