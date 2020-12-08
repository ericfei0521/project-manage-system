import React, { useState, useEffect } from "react";
import "../../style/imageupload.css";
import { storage, firestore } from "../../firebase";

const ImageDropper = (id) => {
  let [image, setImage] = useState(null);
  let [isupload, setUpload] = useState(true);
  useEffect(() => {
    firestore
      .collection("subtasks")
      .doc(id.id)
      .onSnapshot((doc) => {
        if (doc.data().image !== undefined) {
          setImage(doc.data().image);
        }
      });
  });
  const handleFiles = (e) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      console.log(file);
      var storageRef = storage.ref(`images/${id.id}`);
      storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then((url) => {
          console.log(url);
          firestore.collection("subtasks").doc(id.id).update({
            image: url,
          });
          setUpload(!isupload);
        });
      });
    }
  };

  return (
    <div id="dropArea">
      <img
        src={image}
        alt=""
        width="100px"
        height="100px"
        onClick={() => setUpload(!isupload)}
      />

      <div>
        {isupload ? (
          <form className="my-form">
            <p>Drage image here</p>
            <input type="file" accept="image/*" onChange={handleFiles} />
          </form>
        ) : (
          <button onClick={() => setUpload(!isupload)}>Upload Image</button>
        )}
      </div>
    </div>
  );
};

export default ImageDropper;
