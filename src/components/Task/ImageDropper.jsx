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
  const [isupload, setUpload] = useState(openupload);
  const [deleteshow, setDelete] = useState(false);
  const [uploading, setuploading] = useState(false);

  useEffect(() => {
    if (openupload === true) {
      setUpload(true);
    } else {
      setUpload(false);
    }
  }, [openupload]);
  const handleFiles = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      var storageRef = storage.ref(`images/${id}`);
      storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then((url) => {
          firestore.collection("subtasks").doc(id).update({
            image: url,
          });
          setuploading(false);
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
    <div className={style.Image}>
      <h2>Image :</h2>
      {isupload ? (
        <div className={style.dropArea}>
          <form>
            <label htmlFor="file-upload">Upload</label>
            {uploading ? <div className={style.loader}></div> : <></>}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFiles(e);
                setuploading(true);
              }}
              id="file-upload"
            />
            <button onClick={() => handleupload()}>✖</button>
          </form>
        </div>
      ) : (
        <div className={style.imagearea}>
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
