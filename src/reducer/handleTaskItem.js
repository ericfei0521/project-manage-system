const HandleTaskMember = (state = {}, action) => {
  switch (action.type) {
    case "SHOW_TASKITEM": {
      let newlist = {
        ...state,
        taskID: action.payload.taskID,
        id: action.payload.id,
        name: action.payload.name,
        state: action.payload.state,
      };
      return newlist;
    }

    default:
      return state;
  }
};
export default HandleTaskMember;
