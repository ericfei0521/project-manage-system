import React, { useState, useEffect } from "react";
import Header from "../head/header";
import PrjectCard from "./prjectCard";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase";

function ProjectList() {
  let history = useHistory();
  let projects = firestore.collection("projects");
  let [userID, setUserID] = useState(null);
  let [dataProject, setProjects] = useState([]);
  //監聽使用者登入
  useEffect(() => {
    let user = auth.currentUser;
    if (user) {
      setUserID(user.uid);
    }
    projects.onSnapshot(function (doc) {
      console.log("abc");
      let updateData = [];
      // console.log(userID)
      doc.forEach((item) => {
        let member = item.data().member;
        if (member.includes(userID)) {
          let dataitem = {
            name: item.data().name,
            id: item.id,
          };
          updateData.push(dataitem);
        }
      });
      setProjects(updateData);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);
  const routeChange = () => {
    auth.signOut().then(function () {
      // Sign-out successful.
      history.push("/");
    });
  };

  return (
    <div>
      <div>
        <Header />
        {dataProject.map((item) => (
          <PrjectCard key={item.id} id={item.id} name={item.name} />
        ))}
        <button
          onClick={() => {
            let name = prompt("please enter project name", "name");
            firestore.collection("projects").add({
              member: [userID],
              name: name,
            });
          }}
        >
          +
        </button>
        <button onClick={routeChange}>signout</button>
      </div>
    </div>
  );
}
export default ProjectList;
