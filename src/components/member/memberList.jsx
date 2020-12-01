import React from "react";
import { useSelector } from "react-redux";

const MemberList = (props) => {
  const state = useSelector((state) => state.Handleshowmember);
  console.log(state);

  return (
    <div>
      <button onClick={() => props.showmember()}>X</button>
      {state.member.map((item) => (
        <h1 key={item.userID}>{item.displayName}</h1>
      ))}
    </div>
  );
};
export default MemberList;
