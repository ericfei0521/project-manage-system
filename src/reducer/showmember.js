import { SHOW } from "../action/actionType";

let initial = {
  show: false,
  member: [],
  allusers: [],
};

const Handleshowmember = (state = initial, action) => {
  switch (action.type) {
    case SHOW: {
      state = action.payload;
      console.log(action.payload);
      return state;
    }

    default:
      return state;
  }
};
export default Handleshowmember;
