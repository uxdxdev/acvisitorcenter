const initialState = {
  uid: null,
  onlineStatus: null,
};

const waitingListReducer = (state, action) => {
  switch (action.type) {
    case "JOIN_QUEUE":
      return { ...state, isJoiningQueue: true, isJoiningQueueError: null };
    case "JOIN_QUEUE_SUCCESS":
      return {
        ...state,
        isJoiningQueue: false,
        isJoiningQueueError: null,
      };
    case "JOIN_QUEUE_FAIL":
      return {
        ...state,
        isJoiningQueue: false,
        isJoiningQueueError: action.error,
      };
    case "DELETE_USER":
      return { ...state, isDeletingUser: true, isDeletingUserError: null };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        isDeletingUser: false,
        isDeletingUserError: null,
      };
    case "DELETE_USER_FAIL":
      return {
        ...state,
        isDeletingUser: false,
        isDeletingUserError: action.error,
      };

    case "SET_NEXT_VISITOR":
      return {
        ...state,
        isSettingNextVisitor: true,
        isSettingNextVisitorError: null,
      };
    case "SET_NEXT_VISITOR_SUCCESS":
      return {
        ...state,
        isSettingNextVisitor: false,
        isSettingNextVisitorError: null,
      };
    case "SET_NEXT_VISITOR_FAIL":
      return {
        ...state,
        isSettingNextVisitor: false,
        isSettingNextVisitorError: action.error,
      };

    case "RESET_WAITING_LIST":
      return { ...state, ...initialState };
    default:
      return state;
  }
};

export default waitingListReducer;
