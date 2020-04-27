const initialState = {
  uid: null,
  onlineStatus: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, uid: action.uid };
    case "UNAUTH":
      return { ...state, uid: null };
    case "ONLINE_STATUS":
      return { ...state, onlineStatus: action.onlineStatus };
    case "RESET_AUTH":
      return { ...state, ...initialState };
    default:
      return state;
  }
};

export default authReducer;
