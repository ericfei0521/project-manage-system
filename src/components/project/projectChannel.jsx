import React, { useState, useEffect, useRef } from "react";
import style from "../../style/projectChannel.module.scss";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase";

const ProjectChannel = ({ channelID }) => {
  const divRref = useRef(null);
  const textref = useRef(null);
  const user = useSelector((state) => state.UserCheck);
  const channelpath = firestore.collection("projects").doc(channelID);
  const userPath = firestore.collection("users");
  const [showmember, setShowmember] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [newmessage, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [member, setMember] = useState([]);
  const [content, setContent] = useState([]);
  useEffect(() => {
    const unsubscribemessage = channelpath
      .collection("channel")
      .orderBy("time")
      .onSnapshot((doc) => {
        const message = [];
        doc.forEach((item) => {
          message.push(item.data());
        });
        setContent(message);
      });
    const unsubscribmemberlist = channelpath.onSnapshot((doc) => {
      const memberlist = [];
      const members = [];
      if (!doc) {
        return;
      }
      setChannelName(doc.data().name);
      doc.data().member.forEach((item) => {
        memberlist.push(item);
      });
      userPath.get().then((doc) => {
        doc.forEach((data) => {
          if (memberlist.includes(data.id)) {
            members.push(data.data());
          }
        });
        setMember(members);
      });
    });

    userPath
      .doc(user)
      .get()
      .then((doc) => {
        setCurrentUser(doc.data());
      });
    return () => {
      unsubscribemessage();
      unsubscribmemberlist();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelID]);
  useEffect(() => {
    scrollToBottom();
  }, [content]);
  const updateMessage = () => {
    const time = Date.now();
    const data = {
      from: currentUser.displayName,
      text: newmessage,
      time: time,
    };
    console.log(data);
    channelpath.collection("channel").add(data);
  };
  const textareaResize = (element) => {
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };
  const scrollToBottom = () => {
    // console.log(divRref.current.scrollHeight)
    divRref.current.scrollTop = divRref.current.scrollHeight;
  };
  return (
    <div className={style.channel}>
      {showmember ? (
        <div className={style.memberlist}>
          <button onClick={() => setShowmember(false)}>X</button>
          <div className={style.title}>
            <h1>Member list</h1>
          </div>
          {member.map((item, index) => (
            <div className={style.members} key={index}>
              <h3>{item.displayName}</h3>
              <h3> {item.email}</h3>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}

      <div className={style.channelHead}>
        <h1>{channelName}</h1>
        <div className={style.showmember} onClick={() => setShowmember(true)}>
          {member.map((item, index) => (
            <div
              key={index}
              className={style.from}
              style={index > 3 ? { display: "none" } : { display: "block" }}
            >
              {item.displayName.charAt(0)}
            </div>
          ))}
          <h2>{member.length}</h2>
        </div>
      </div>
      <div className={style.wrap}>
        <div className={style.messagearea} ref={divRref}>
          {content.map((item, index) =>
            item.from === "system" ? (
              <div className={style.welcome} key={index}>
                <h1> {item.text}</h1>
              </div>
            ) : (
              <div className={style.message}>
                <div className={style.from}>
                  <div> {item.from.charAt(0)}</div>
                </div>
                <div className={style.messagedetail}>
                  <div className={style.fromdetail}>
                    <h2 className={style.name}> {item.from}</h2>
                    <h2 className={style.date}>
                      <Moment format="YYYY/MM/DD hh:mm">{item.time}</Moment>
                    </h2>
                  </div>
                  <p>{item.text}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className={style.inputarea}>
        <div className={style.textinput}>
          <textarea
            name=""
            ref={textref}
            data-emoji-input="unicode"
            value={newmessage}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => textareaResize(e.target)}
          ></textarea>
        </div>
        <div className={style.sendbutton}>
          <button
            onClick={() => {
              updateMessage();
              textref.current.style.height = "40px";
              setMessage("");
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ProjectChannel;
