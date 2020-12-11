import React, { useState } from "react";
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
    <div>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Email"
      />
      <button onClick={() => props.showmember()}>X</button>
      {state.allusers.map((item) => {
        if (
          name !== "" &&
          item.email.toLowerCase().includes(name.toLocaleLowerCase())
        ) {
          if (props.member.includes(item.userID)) {
            return (
              <div
                style={{
                  display: "flex",
                  padding: "5px",
                  marginBottom: "5px",
                  border: "1px solid white",
                }}
              >
                {item.displayName}
                <br />
                {item.email}
                <br />
                Already In Project
              </div>
            );
          } else {
            return (
              <div>
                {item.displayName} <br />
                {item.email}
                <button onClick={() => updateFirestore(item.userID)}>+</button>
              </div>
            );
          }
        } else {
          return null;
        }
      })}
    </div>
  );
};
export default AlluserList;
