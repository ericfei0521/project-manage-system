import React, { useEffect } from "react";
import { firestore } from "../../firebase";
const Todos = ({ user }) => {
  //   let [todolist, setTodolist] = useState([])
  //   let [todoName, setTodoName] = useState('')
  useEffect(() => {
    let list = [];
    firestore
      .collection("users")
      .doc(user)
      .collection("todos")
      .onSnapshot((doc) => {
        if (doc) {
          doc.forEach((item) => {
            list.push(item.data());
          });
          //   setTodolist(list)
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h1>{user}</h1>
      <div>
        <input type="text" />
        <input type="text" />
      </div>
      <div>
        <button>Add Todo</button>
      </div>
    </div>
  );
};
export default Todos;
