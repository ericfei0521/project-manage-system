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
              let member = item.data().member;
              for (let i = 0; i < member.length; i++) {
                if (member[i] === userID) {
                  let dataitem = {
                    name: item.data().name,
                    id: item.id,
                  };
                  data.push(dataitem);
                }
              }
            });
          })
          .then(() => {
            setProjects(data);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    projects.onSnapshot(function (doc) {
      let updateData = [];
      doc.forEach((item) => {
        let member = item.data().member;
        for (let i = 0; i < member.length; i++) {
          if (member[i] === userID) {
            let dataitem = {
              name: item.data().name,
              id: item.id,
            };
            updateData.push(dataitem);
          }
        }
      });
      setProjects(updateData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
