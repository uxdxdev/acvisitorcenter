const initialState = {
  isJoiningQueue: false,
  isJoiningQueueError: null,

  isDeletingUser: false,
  isDeletingUserError: null,

  isSettingNextVisitor: false,
  isSettingNextVisitorError: null,
};

const waitingListReducer = (state, action) => {
  switch (action.type) {
    case "JOIN_QUEUE":
      return {
        ...state,
        isJoiningQueue: true,
        // do not remove a previous error, use must refresh the page
        // to try join again
        // isJoiningQueueError: null,
      };
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

    case "CLEAR_WAITING_LIST":
      return {
        ...state,
        isClearingWaitlist: true,
        isClearingWaitlistError: null,
      };
    case "CLEAR_WAITING_LIST_SUCCESS":
      return {
        ...state,
        isClearingWaitlist: false,
        isClearingWaitlistError: null,
      };
    case "CLEAR_WAITING_LIST_FAIL":
      return {
        ...state,
        isClearingWaitlist: false,
        isClearingWaitlistError: action.error,
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
