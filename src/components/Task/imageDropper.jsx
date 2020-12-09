import React, { useState, useEffect } from "react";
import "../../style/imageupload.css";
import { storage, firestore } from "../../firebase";

const ImageDropper = (id) => {
  let [image, setImage] = useState(null);
  let [isupload, setUpload] = useState(false);
  useEffect(() => {
    firestore
      .collection("subtasks")
      .doc(id.id)
      .onSnapshot((doc) => {
        if (doc.data() !== undefined) {
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
    <div>
      <div>
        {isupload ? (
          <div id="dropArea">
            <form className="my-form">
              <input type="file" accept="image/*" onChange={handleFiles} />
              <button onClick={() => setUpload(!isupload)}>back</button>
            </form>
          </div>
        ) : (
          <div>
            {image ? (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundImage: `url(${image})`,
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "gray",
                  textAlign: "center",
                }}
                onClick={() => setUpload(!isupload)}
              >
                Upload image here
              </div>
            )}
            <button onClick={() => setUpload(!isupload)}>Upload Image</button>
            <button onClick={() => setUpload(!isupload)}>Delete Image</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropper;
