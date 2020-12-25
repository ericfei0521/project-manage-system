import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as ListIcon } from "../../images/ICON/alllist.svg";
import { ReactComponent as Membertasks } from "../../images/ICON/membertasks.svg";
import { ReactComponent as Progress } from "../../images/ICON/progress.svg";
import { ReactComponent as Members } from "../../images/ICON/users.svg";
import { ReactComponent as Addmember } from "../../images/ICON/useregular.svg";
import { ReactComponent as Delete } from "../../images/ICON/delete.svg";
import Header from "../head/header";
import TaskList from "../Task/taskList";
import Tasks from "./Tasks";
import MemberList from "../member/memberList";
import AlluserList from "../member/alluserList";
import TaskItem from "../Task/taskItem";
import Performance from "./performance";
import Loading from "../loading";
import logo from "../../images/logowelcome.png";
import style from "../../style/project.module.scss";
import { addList, getMember, deleteProject } from "../../action/action";
import { useParams, Link, useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

const Project = () => {
  const inputref = useRef(null);
  let dispatch = useDispatch();
  let history = useHistory();
  let { projectId } = useParams();
  const state = useSelector((state) => state.HandleTaskMember);
  let project = firestore.collection("projects").doc(projectId);
  let [load, setLoad] = useState(true);
  let [open, setOpen] = useState(false);
  let [name, setName] = useState("");
  let [projectstate, setState] = useState("");
  let [listname, setListName] = useState("");
  let [memberNum, setMemberNum] = useState([]);
  let [tasks, setTasks] = useState([]);
  let [showdelete, setDelete] = useState(false);
  let [membershow, setMemberShow] = useState(false);
  let [showallusers, setAllusers] = useState(false);
  let [currentPage, setCurrentPage] = useState("all");
  let [confirm, setconfirm] = useState("");
  let [addCard, setAddcard] = useState(false);
  let [worning, setWorning] = useState(false);
  let [allsub, setAllsub] = useState([]);

  useEffect(() => {
    let unsubscribemember = project.onSnapshot(function (doc) {
      if (!doc.data()) {
        history.push("/");
      }
      // console.log(doc.data())
      if (doc.data() !== undefined) {
        let data = doc.data();
        setName(data.name);
        setState(data.state);
        let list = [];
        data.member.forEach((item) => {
          list.push(item);
        });
        setMemberNum(list);
      }
    });
    let unsubscribeAlltasks = project
      .collection("tasks")
      .orderBy("createTime")
      .onSnapshot(function (doc) {
        let listTask = [];
        doc.forEach((item) => {
          let data = {
            id: item.id,
            name: item.data().name,
          };
          listTask.push(data);
        });
        setTasks(listTask);
      });
    let unsubscribeAllsubtasks = firestore
      .collection("subtasks")
      .onSnapshot((doc) => {
        let newallsub = [];
        doc.forEach((data) => {
          if (data.data().project === projectId) {
            let dataitem = {
              id: data.id,
              name: data.data().name,
              state: data.data().state,
              index: data.data().index,
              listid: data.data().listid,
              image: data.data().image,
            };
            newallsub.push(dataitem);
          }
        });
        setAllsub(newallsub);
      });
    return () => {
      unsubscribemember();
      unsubscribeAlltasks();
      unsubscribeAllsubtasks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setTimeout(() => setLoad(false), 1000);
  }, [tasks]);
  const handlemember = () => {
    setMemberShow(!membershow);
  };
  const handleAddmember = () => {
    setAllusers(!showallusers);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDrag = (result) => {
    console.log(result);

    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }
    const dropStart = result.source.droppableId;
    const dropEnd = result.destination.droppableId;
    console.log(dropStart);
    console.log(dropEnd);
    let batch = firestore.batch();
    if (dropEnd === dropStart) {
      let newarray = allsub.filter((item) => item.listid !== dropEnd);
      let rearrangearray = allsub
        .filter((item) => item.listid === dropEnd)
        .sort((a, b) => a.index - b.index);
      // let rearrangeid = []
      // rearrangearray.forEach((data) => {
      //   rearrangeid.push(data.id)
      // })
      const [reorderItem] = rearrangearray.splice(result.source.index, 1);
      rearrangearray.splice(result.destination.index, 0, reorderItem);
      for (let i = 0; i < rearrangearray.length; i++) {
        rearrangearray.forEach((data) => {
          if (rearrangearray[i].id === data.id) {
            data.index = i;
          }
        });
        let path = firestore.collection("subtasks").doc(rearrangearray[i].id);
        batch.update(path, { index: i });
      }
      rearrangearray.forEach((newitem) => {
        newarray.push(newitem);
      });

      batch.commit();
    } else {
      console.log(result);
      let newallsub = [...allsub];
      let sourcearray = allsub
        .filter((item) => item.listid === dropStart)
        .sort((a, b) => a.index - b.index);
      let sourceRearrangeid = [];
      sourcearray.forEach((data) => {
        sourceRearrangeid.push(data.id);
      });
      const item = Array.from(sourceRearrangeid);
      item.splice(result.source.index, 1);
      console.log(item);
      for (let i = 0; i < item.length; i++) {
        newallsub.forEach((data) => {
          if (data.id === item[i]) {
            data.index = i;
          }
        });
      }
      let destinationarray = allsub
        .filter((item) => item.listid === dropEnd)
        .sort((a, b) => a.index - b.index);
      let destinationarrayid = [];
      destinationarray.forEach((data) => {
        destinationarrayid.push(data.id);
      });
      const destitem = Array.from(destinationarrayid);
      destitem.splice(result.destination.index, 0, result.draggableId);
      console.log(destitem);
      destitem.forEach((data, index) => {
        for (let i in newallsub) {
          if (newallsub[i].id === data) {
            newallsub[i].index = index;
            newallsub[i].listid = dropEnd;
          }
        }
      });
      setAllsub(newallsub);
      newallsub.forEach((item) => {
        let path = firestore.collection("subtasks").doc(item.id);
        batch.update(path, {
          index: item.index,
          listid: item.listid,
        });
      });
      batch.commit();
    }
  };
  const routeChange = () => {
    auth.signOut().then(function () {
      history.push("/");
    });
  };
  console.log(allsub);
  return (
    <div className={style.project}>
      <div className={style.nav}>
        <div className={style.logo}>
          <Link to="/projects">
            <img src={logo} alt="" />
          </Link>
          <button></button>
        </div>
        <div className={style.sidebutton} onClick={() => setCurrentPage("all")}>
          <ListIcon className={style.icon} />
          <button>Tasks list</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            setCurrentPage("tasks");
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
          }}
        >
          <Membertasks className={style.icon} />
          <button>Performance</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            setCurrentPage("performance");
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
          }}
        >
          <Progress className={style.icon} />
          <button>Progress</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            console.log(membershow);
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
            setMemberShow(!membershow);
          }}
        >
          <Members className={style.icon} />
          <button>Members</button>
        </div>
        <div
          className={style.sidebutton}
          onClick={() => {
            dispatch(
              getMember({
                show: membershow,
                member: memberNum,
              })
            );
            setAllusers(!showallusers);
          }}
        >
          <Addmember className={style.icon} />
          <button>Add member</button>
        </div>
        <div
          className={style.showdelete}
          onClick={() => setDelete(!showdelete)}
        >
          <Delete className={style.delicon} />
          <button>Delete</button>
        </div>
      </div>
      <div className={style.displayarea}>
        <Header
          id={projectId}
          state={projectstate}
          name={name}
          signOut={routeChange}
        />
        {currentPage === "performance" ? (
          <Performance projectid={projectId} member={memberNum} name={name} />
        ) : (
          <></>
        )}
        {currentPage === "tasks" ? (
          <Tasks projectid={projectId} member={memberNum} />
        ) : (
          <></>
        )}
        {currentPage === "all" ? (
          <div className={style.projectlist}>
            <DragDropContext onDragEnd={handleDrag}>
              <div className={style.projects}>
                {tasks.map((item) => (
                  <TaskList
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    open={handleOpen}
                    allsub={allsub}
                  />
                ))}
                <div className={style.addCard}>
                  <button
                    className={`${style.addcardbutton} ${
                      addCard ? "" : style.openaddbutton
                    }`}
                    onClick={() => setAddcard(true)}
                  >
                    + Add another list
                  </button>
                  <div
                    className={`${style.addcarddetail} ${
                      addCard ? style.openaddbutton : ""
                    }`}
                  >
                    <input
                      onChange={(e) => setListName(e.target.value)}
                      className={worning ? style.worning : ""}
                      value={listname}
                      autoFocus
                      ref={inputref}
                      type="text"
                      placeholder="Enter list name"
                    />
                    <div className={style.detialbutton}>
                      <button
                        onClick={() => {
                          if (listname !== "") {
                            dispatch(
                              addList({
                                id: projectId,
                                name: listname,
                              })
                            );
                            setListName("");
                            setWorning(false);
                            setAddcard(false);
                          } else {
                            inputref.current.placeholder =
                              "Please enter list name";
                            setWorning(true);
                          }
                        }}
                      >
                        Add list
                      </button>
                      <button onClick={() => setAddcard(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </DragDropContext>
            {open ? (
              <div
                className={style.taskdetail}
                id="taskdetail"
                onClick={(e) => {
                  if (e.target.id === "taskdetail") {
                    handleOpen();
                  }
                }}
              >
                <TaskItem
                  taskID={state.taskID}
                  id={state.id}
                  name={state.name}
                  state={state.state}
                  open={handleOpen}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      <div style={load ? { display: "block" } : { display: "none" }}>
        <Loading />
      </div>
      {showallusers ? (
        <div className={style.allList}>
          <AlluserList
            projectid={projectId}
            member={memberNum}
            showmember={handleAddmember}
          />
        </div>
      ) : (
        <></>
      )}
      {membershow ? (
        <div className={style.memberList}>
          <MemberList
            projectid={projectId}
            member={memberNum}
            showmember={handlemember}
          />
        </div>
      ) : (
        <></>
      )}
      {showdelete ? (
        <div
          id="deleteoutside"
          className={style.delete}
          onClick={(e) => {
            e.target.id === "deleteoutside"
              ? setDelete(false)
              : setDelete(true);
          }}
        >
          <div className={style.deletannounce}>
            <div className={style.announce}>
              <h1>Delete this Project ?</h1>
              <p>
                Doing so will permanently delete the data,including all nested
                tasks
              </p>
            </div>
            <div className={style.confirm}>
              <div className={style.confirmannounce}>
                <p>
                  Confirm you want to delete this project by typing its ID :
                </p>
                <h2>{projectId}</h2>
              </div>
              <input
                type="text"
                autoFocus
                onChange={(e) => setconfirm(e.target.value)}
              />
              <Link
                to="/projects"
                className={style.delelink}
                style={
                  confirm === projectId
                    ? { pointerEvents: "auto" }
                    : { pointerEvents: "none" }
                }
              >
                <button
                  className={
                    confirm === projectId ? style.avaliable : style.disable
                  }
                  onClick={() => {
                    dispatch(
                      deleteProject({
                        projectId: projectId,
                      })
                    );
                  }}
                >
                  Delete
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Project;
