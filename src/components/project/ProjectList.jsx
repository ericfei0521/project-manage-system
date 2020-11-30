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
  let [isAdd, setAdd] = useState(false);
  let [newProjectName, setNewProjectsName] = useState("");
  let [newProjectState, setNewProjectState] = useState("On-hold");
  //監聽使用者登入
  useEffect(() => {
    let user = auth.currentUser;
    if (!user) {
      history.push("/login");
    } else {
      setUserID(user.uid);
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
              state: item.data().state,
            };
            updateData.push(dataitem);
          }
        });
        setProjects(updateData);
      });
    }
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
        <button onClick={routeChange}>signout</button>
        {dataProject.map((item) => (
          <PrjectCard
            key={item.id}
            id={item.id}
            name={item.name}
            state={item.state}
          />
        ))}
        {isAdd ? (
          <div>
            <input
              onChange={(e) => setNewProjectsName(e.target.value)}
              value={newProjectName}
              type="text"
              placeholder="Project Name"
            />
            <select
              onChange={(e) => setNewProjectState(e.target.value)}
              value={newProjectState}
            >
              <option value="On-hold">On-hold</option>
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Complete">Complete</option>
            </select>
            <button
              onClick={() => {
                firestore.collection("projects").add({
                  member: [userID],
                  name: newProjectName,
                  state: newProjectState,
                });
                setNewProjectsName("");
                setNewProjectState("On-hold");
                setAdd(true);
              }}
            >
              Add Project
            </button>
            <button onClick={() => setAdd(true)}>X</button>
          </div>
        ) : (
          <button onClick={() => setAdd(true)}>Add Project</button>
        )}
      </div>
    </div>
  );
}
export default ProjectList;
