import React, { useState, useEffect } from "react";
import style from "../../style/imageupload.module.scss";
import { storage, firestore } from "../../firebase";

const ImageDropper = ({
  id,
  image,
  openupload,
  handleupload,
  handleshowbigimg,
}) => {
  let [isupload, setUpload] = useState(openupload);
  let [deleteshow, setDelete] = useState(false);
  console.log(id);
  useEffect(() => {
    if (openupload === true) {
      setUpload(true);
    } else {
      setUpload(false);
    }
  }, [openupload]);
  const handleFiles = (e) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      console.log(file);
      var storageRef = storage.ref(`images/${id}`);
      storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then((url) => {
          console.log(url);
          firestore.collection("subtasks").doc(id).update({
            image: url,
          });
          setUpload(false);
          setDelete(false);
        });
      });
    }
  };
  const deleteimage = () => {
    storage
      .ref(`images/${id}`)
      .delete()
      .then(() => {
        firestore.collection("subtasks").doc(id).update({
          image: "",
        });
      });
  };
  return (
    <div>
      {isupload ? (
        <div className={style.dropArea}>
          <form>
            <label for="file-upload">Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFiles}
              id="file-upload"
            />
            <button onClick={() => handleupload()}>✖</button>
          </form>
        </div>
      ) : (
        <div>
          {image ? (
            <div className={style.gallery}>
              <div
                className={style.image}
                style={{ backgroundImage: `url(${image})` }}
                alt={image}
                onClick={() => handleshowbigimg()}
              ></div>
              {deleteshow ? (
                <div className={style.deletshow}>
                  <h1>Delete Image?</h1>
                  <p>Data will be permanently deleted</p>
                  <div className={style.btns}>
                    <div
                      className={style.deletebtn}
                      onClick={() => {
                        handleupload();
                        deleteimage();
                      }}
                    >
                      Delete
                    </div>
                    <div
                      className={style.deletebtn}
                      onClick={() => setDelete(false)}
                    >
                      Back
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => setDelete(true)}>✖</button>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDropper;
