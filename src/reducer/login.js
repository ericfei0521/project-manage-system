import { auth } from "../firebase";

let initialState = {
  email: "",
  password: "",
};
const Login = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN": {
      state = action.payload;
      auth
        .signInWithEmailAndPassword(state.email, state.password)
        .catch((error) => {
          alert(error.message);
        });
      return state;
    }

    default:
      return state;
  }
};

export default Login;
