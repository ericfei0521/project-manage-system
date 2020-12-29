const UserCheck = (state = "", action) => {
  switch (action.type) {
    case "USER_CHECK":
      return action.payload;

    default:
      return state;
  }
};

export default UserCheck;
