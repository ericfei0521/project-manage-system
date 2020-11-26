import { auth } from "../firebase";
let initialState = {
  email: "",
  password: "",
  confirmpassword: "",
};
const Signup = (state = initialState, action) => {
  const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  switch (action.type) {
    case "SIGN_UP": {
      console.log(action.payload);
      if (action.payload.password !== action.payload.confirmpassword) {
        alert("password don't match");
        return state;
      } else if (action.payload.password.length < 6) {
        alert("please enter at least 6 character password");
        return state;
      } else if (action.payload.email.search(emailRule) === -1) {
        alert("please enter correct email");
        return state;
      }
      state = action.payload;
      if (
        state.email !== "" &&
        state.password !== "" &&
        state.confirmpassword !== ""
      ) {
        auth.createUserWithEmailAndPassword(state.email, state.password);
      }
      return state;
    }

    default:
      return state;
  }
};

export default Signup;
