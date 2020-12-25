import React, { useState } from "react";
import style from "../../style/memberList.module.scss";
import { useSelector } from "react-redux";
import firebase from "firebase/app";
import { firestore } from "../../firebase";

const AlluserList = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  let [name, setName] = useState("");
  let project = firestore.collection("projects").doc(props.projectid);
  const updateFirestore = (value) => {
    project.update({
      member: firebase.firestore.FieldValue.arrayUnion(value),
    });
  };
  return (
    <div className={style.alluser}>
      <div className={style.backbutton}>
        <div></div>
        <h1>Search member</h1>
        <button className={style.back} onClick={() => props.showmember()}>
          X
        </button>
      </div>
      <input
        autoFocus
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Email"
      />
      <div className={style.showing}>
        <div className={style.showinner}>
          {state.allusers.map((item) => {
            if (
              name !== "" &&
              item.email.toLowerCase().includes(name.toLocaleLowerCase())
            ) {
              if (props.member.includes(item.userID)) {
                return (
                  <div key={item.userID} className={style.inlist}>
                    <h2> {item.displayName}</h2>
                    <h2> {item.email}</h2>
                    <h2> Already In Project</h2>
                  </div>
                );
              } else {
                return (
                  <div className={style.pendinglist}>
                    <div className={style.adding}>
                      <h2> {item.displayName}</h2>
                      <button onClick={() => updateFirestore(item.userID)}>
                        +
                      </button>
                    </div>
                    <h2>{item.email}</h2>
                  </div>
                );
              }
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};
export default AlluserList;
