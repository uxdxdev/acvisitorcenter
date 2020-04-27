const initialState = {
  uid: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, uid: action.uid };
    case "UNAUTH":
      return { ...state, uid: null };
    case "RESET_AUTH":
      return { ...state, ...initialState };
    default:
      return state;
  }
};

export default authReducer;
