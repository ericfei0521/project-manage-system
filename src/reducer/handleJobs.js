let initail = {
  dueDate: "",
  startDate: "",
  member: "",
  name: "",
  state: "",
  comment: [],
};

const HandleJobs = (state = initail, action) => {
  switch (action.type) {
    case "ADD_JOBS": {
      console.log(action.payload);
      return state;
    }
    default:
      return state;
  }
};

export default HandleJobs;
