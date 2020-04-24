import React, { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "AUTH":
        return { ...state, uid: action.uid };
      case "UNAUTH":
        return { ...state, uid: null };
      case "CREATE_QUEUE":
        return { ...state, isCreatingQueue: true };
      case "CREATE_QUEUE_SUCCESS":
        return { ...state, isCreatingQueue: false, queueId: action.queueId };
      case "CREATE_QUEUE_FAIL":
        return {
          ...state,
          isCreatingQueue: false,
          queueId: null,
          createQueueError: action.error,
        };
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
      case "FETCH_QUEUE_DATA":
        return {
          ...state,
          isFetchingQueue: true,
          isFetchingQueueError: null,
        };
      case "FETCH_QUEUE_DATA_SUCCESS":
        return {
          ...state,
          isFetchingQueue: false,
          queueData: action.queueData,
          isFetchingQueueError: null,
        };
      case "FETCH_QUEUE_DATA_FAIL":
        return {
          ...state,
          isFetchingQueue: false,
          queueData: null,
          isFetchingQueueError: action.error,
        };
      case "FETCH_LATEST_QUEUES":
        return {
          ...state,
          isFetchingLatestQueues: true,
          isFetchingLatestQueuesError: null,
        };
      case "FETCH_LATEST_QUEUES_SUCCESS":
        return {
          ...state,
          isFetchingLatestQueues: false,
          latestQueues: action.latestQueues,
          isFetchingLatestQueuesError: null,
        };
      case "FETCH_LATEST_QUEUES_FAIL":
        return {
          ...state,
          isFetchingLatestQueues: false,
          latestQueues: null,
          isFetchingLatestQueuesError: action.error,
        };
      case "FETCH_ISLAND_CODE":
        return {
          ...state,
          isFetchingIslandCode: true,
          isFetchingIslandCodeError: null,
        };
      case "FETCH_ISLAND_CODE_SUCCESS":
        return {
          ...state,
          isFetchingIslandCode: false,
          islandCode: action.islandCode,
          isFetchingIslandCodeError: null,
        };
      case "FETCH_ISLAND_CODE_FAIL":
        return {
          ...state,
          isFetchingIslandCode: false,
          islandCode: null,
          isFetchingIslandCodeError: action.error,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
