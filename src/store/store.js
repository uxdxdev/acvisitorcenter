import React, { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    if (process.env.NODE_ENV === "development") {
      action?.type && console.log(action.type);
      action?.error && console.log(action.error);
    }
    switch (action.type) {
      case "AUTH":
        return { ...state, uid: action.uid };
      case "UNAUTH":
        return { ...state, uid: null };
      case "CREATE_CENTER":
        return { ...state, isCreatingCenter: true };
      case "CREATE_CENTER_SUCCESS":
        return { ...state, isCreatingCenter: false, centerId: action.centerId };
      case "CREATE_CENTER_FAIL":
        return {
          ...state,
          isCreatingCenter: false,
          centerId: null,
          createVisitorCenterError: action.error,
        };
      case "JOIN_CENTER":
        return { ...state, isJoiningQueue: true, isJoiningQueueError: null };
      case "JOIN_CENTER_SUCCESS":
        return {
          ...state,
          isJoiningQueue: false,
          isJoiningQueueError: null,
        };
      case "JOIN_CENTER_FAIL":
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
      case "LISTEN_CENTER_DATA":
        return {
          ...state,
          isFetchingCenterData: true,
          isFetchingCenterDataError: null,
        };
      case "LISTEN_CENTER_DATA_SUCCESS":
        return {
          ...state,
          isFetchingCenterData: false,
          centerData: action.centerData,
          isFetchingCenterDataError: null,
        };
      case "LISTEN_CENTER_DATA_FAIL":
        return {
          ...state,
          isFetchingCenterData: false,
          centerData: null,
          isFetchingCenterDataError: action.error,
        };
      case "LISTEN_LATEST_CENTERS":
        return {
          ...state,
          isFetchingLatestCenters: true,
          isFetchingLatestCentersError: null,
        };
      case "LISTEN_LATEST_CENTERS_SUCCESS":
        return {
          ...state,
          isFetchingLatestCenters: false,
          latestCenters: action.latestCenters,
          isFetchingLatestCentersError: null,
        };
      case "LISTEN_LATEST_CENTERS_FAIL":
        return {
          ...state,
          isFetchingLatestCenters: false,
          latestCenters: null,
          isFetchingLatestCentersError: action.error,
        };
      case "FETCH_DODO_CODE":
        return {
          ...state,
          isFetchingDodoCode: true,
          isFetchingDodoCodeError: null,
        };
      case "FETCH_DODO_CODE_SUCCESS":
        return {
          ...state,
          isFetchingDodoCode: false,
          dodoCode: action.dodoCode,
          isFetchingDodoCodeError: null,
        };
      case "FETCH_DODO_CODE_FAIL":
        return {
          ...state,
          isFetchingDodoCode: false,
          dodoCode: null,
          isFetchingDodoCodeError: action.error,
        };

      case "FETCH_VISITOR_CENTER":
        return {
          ...state,
          isFetchingVisitorCenter: true,
          isFetchingVisitorCenterError: null,
        };
      case "FETCH_VISITOR_CENTER_SUCCESS":
        return {
          ...state,
          isFetchingVisitorCenter: false,
          visitorCenterData: action.data,
          isFetchingVisitorCenterError: null,
        };
      case "FETCH_VISITOR_CENTER_FAIL":
        return {
          ...state,
          isFetchingVisitorCenter: false,
          visitorCenterData: null,
          isFetchingVisitorCenterError: action.error,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
