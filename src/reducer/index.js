let initialState = {
  email: "",
  password: "",
};
const allReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN": {
      state.email = action.payload.email;
      state.password = action.payload.password;
      return console.log(state);
    }

    default:
      return state;
  }
};

export default allReducer;
