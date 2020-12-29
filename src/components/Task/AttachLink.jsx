import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { fetchyoutube } from "../../utils/util";
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
  return (
    <div className={style.inputwrap}>
      <input
        type="text"
        onChange={(e) => setYoutubeLink(e.target.value)}
        autoFocus
        placeholder="Enter Youtube Link"
      />
      <div className={style.btns}>
        <button
          onClick={() => fetchyoutube(youtubelink, videolist, id, handleattach)}
        >
          Attach
        </button>
        <button onClick={() => handleattach()}>Cancel</button>
      </div>
    </div>
  );
};
export default Attachlink;
