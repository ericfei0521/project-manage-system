import React, { useState, useEffect } from "react";
import Header from "../head/header";
import PrjectCard from "./prjectCard";
import Loading from "../loading";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, firestore, timestamp } from "../../firebase";

function ProjectList() {
  let history = useHistory();
  const user = useSelector((state) => state.UserCheck);
  let projects = firestore.collection("projects");
  let [load, setLoad] = useState(true);
  let [dataProject, setProjects] = useState([]);
  let [isAdd, setAdd] = useState(false);
  let [newProjectName, setNewProjectsName] = useState("");
  let [newProjectState, setNewProjectState] = useState("On-hold");
  //監聽使用者登入
  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
    let unsubscribe = projects.onSnapshot(function (doc) {
      let updateData = [];
      doc.forEach((item) => {
        let member = item.data().member;
        if (member.includes(user)) {
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
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setTimeout(() => setLoad(false), 200);
  }, [dataProject]);
  const routeChange = () => {
    auth.signOut().then(function () {
      history.push("/");
    });
  };

  return (
    <div>
      <div>
        <Header />
        <div>
          <h1>
            <button>Todos</button>
            <button>Tasks</button>
            <div>
              <button>Channel</button>
              {dataProject.map((item) => (
                <button key={item.id}>{item.name}</button>
              ))}
            </div>
          </h1>
        </div>
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
                firestore
                  .collection("projects")
                  .add({
                    member: [user],
                    name: newProjectName,
                    state: newProjectState,
                    time: timestamp,
                  })
                  .then((docRef) => {
                    firestore
                      .collection("projects")
                      .doc(docRef.id)
                      .collection("channel")
                      .add({
                        text: `wlecome to ${newProjectName} channel`,
                        time: timestamp,
                        from: "system",
                      });
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
      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
    </div>
  );
}
export default ProjectList;
