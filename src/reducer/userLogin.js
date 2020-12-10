const UserCheck = (state = "", action) => {
  switch (action.type) {
    case "USER_CHECK":
      console.log(action.payload);
      return action.payload;

    default:
      return state;
  }
};

export default UserCheck;
