import logo from "../images/logo.svg";
import { useDispatch } from "react-redux";
import { isLogged } from "../action/action";

function RegisterPage() {
  let dispatch = useDispatch();
  return (
    <div className="App">
      <img src={logo} alt="" width="80px" />
      <button onClick={() => dispatch(isLogged())}>Log in</button>
      <button>Sign up</button>
    </div>
  );
}

export default RegisterPage;
