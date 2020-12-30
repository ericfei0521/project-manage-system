import React from "react";
import style from "../../style/memberList.module.scss";
import { useSelector } from "react-redux";

const MemberList = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  return (
    <div>
      <div className={style.backbutton}>
        <div></div>
        <h1>{state.member.length}members</h1>
        <button className={style.back} onClick={() => props.showmember()}>
          X
        </button>
      </div>
      <div className={style.memberarea}>
        {state.member.map((item) => (
          <div className={style.member} key={item.userID}>
            <h1>{item.displayName}</h1>
            <h1>{item.email}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MemberList;
