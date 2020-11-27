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
    auth.onAuthStateChanged(async (userAuth) => {
      if (!userAuth) {
        history.push("/");
      } else {
        setUserID(userAuth.uid);
        let data = [];
        projects
          .get()
          .then(function (doc) {
            doc.forEach((item) => {
              let dataitem = {
                name: item.data().name,
                id: item.id,
              };
              data.push(dataitem);
            });
          })
          .then(() => {
            setProjects(data);
          });
      }
    });
  }, []);
  useEffect(() => {
    console.log("abcd");
    projects.onSnapshot(function (doc) {
      let updateData = [];
      doc.forEach((item) => {
        let updateitem = {
          name: item.data().name,
          id: item.id,
        };
        updateData.push(updateitem);
      });
      if (updateData.length === dataProject.length) {
        return;
      } else {
        setProjects(updateData);
      }
    });
  }, []);
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
            firestore.collection("projects").add({
              name: "test002",
              id: Math.floor(Math.random * 1000),
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
