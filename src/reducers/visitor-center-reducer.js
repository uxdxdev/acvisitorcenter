const initialState = {
  isCreatingVisitorCenter: false,
  createVisitorCenterError: null,

  isFetchingVisitorCenterData: false,
  isFetchingVisitorCenterDataError: null,
  visitorCenterData: null,

  isFetchingLatestCenters: false,
  isFetchingLatestCentersError: null,
  latestCenters: null,

  isUpdatingVisitorCenterData: false,
  isUpdatingVisitorCenterDataError: null,

  onlineStatus: "offline",
};

const visitorCenterReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_VISITOR_CENTER":
      return { ...state, isCreatingVisitorCenter: true };
    case "CREATE_VISITOR_CENTER_SUCCESS":
      return {
        ...state,
        isCreatingVisitorCenter: false,
        createVisitorCenterError: null,
      };
    case "CREATE_VISITOR_CENTER_FAIL":
      return {
        ...state,
        isCreatingVisitorCenter: false,
        createVisitorCenterError: action.error,
      };

    case "FETCH_VISITOR_CENTER_DATA":
      return {
        ...state,
        isFetchingVisitorCenterData: true,
        isFetchingVisitorCenterDataError: null,
      };
    case "FETCH_VISITOR_CENTER_DATA_SUCCESS":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: action.visitorCenterData,
        isFetchingVisitorCenterDataError: null,
      };
    case "FETCH_VISITOR_CENTER_DATA_FAIL":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: null,
        isFetchingVisitorCenterDataError: action.error,
      };

    case "LISTEN_VISITOR_CENTER_DATA":
      return {
        ...state,
        isFetchingVisitorCenterData: true,
        isFetchingVisitorCenterDataError: null,
      };
    case "LISTEN_VISITOR_CENTER_DATA_SUCCESS":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: action.visitorCenterData,
        isFetchingVisitorCenterDataError: null,
      };
    case "LISTEN_VISITOR_CENTER_DATA_FAIL":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: null,
        isFetchingVisitorCenterDataError: action.error,
      };

    case "FETCH_LATEST_CENTERS":
      return {
        ...state,
        isFetchingLatestCenters: true,
        isFetchingLatestCentersError: null,
      };
    case "FETCH_LATEST_CENTERS_SUCCESS":
      return {
        ...state,
        isFetchingLatestCenters: false,
        latestCenters: action.latestCenters,
        isFetchingLatestCentersError: null,
      };
    case "FETCH_LATEST_CENTERS_FAIL":
      return {
        ...state,
        isFetchingLatestCenters: false,
        latestCenters: null,
        isFetchingLatestCentersError: action.error,
      };

    case "UPDATE_VISITOR_CENTER_DATA":
      return {
        ...state,
        isUpdatingVisitorCenterData: true,
        isUpdatingVisitorCenterDataError: null,
      };
    case "UPDATE_VISITOR_CENTER_DATA_SUCCESS":
      return {
        ...state,
        isUpdatingVisitorCenterData: false,
        isUpdatingVisitorCenterDataError: null,
      };
    case "UPDATE_VISITOR_CENTER_DATA_FAIL":
      return {
        ...state,
        isUpdatingVisitorCenterData: false,
        isUpdatingVisitorCenterDataError: action.error,
      };

    case "SET_GATES_OPEN_STATUS":
      return {
        ...state,
        isUpdatingVisitorGateStatus: true,
        isUpdatingVisitorGateStatusError: null,
      };
    case "SET_GATES_OPEN_STATUS_SUCCESS":
      return {
        ...state,
        isUpdatingVisitorGateStatus: false,
        isUpdatingVisitorGateStatusError: null,
      };
    case "SET_GATES_OPEN_STATUS_FAIL":
      return {
        ...state,
        isUpdatingVisitorGateStatus: false,
        isUpdatingVisitorGateStatusError: action.error,
      };

    case "UPDATE_LAST_ACTIVE_NOW":
      return {
        ...state,
        isUpdatingOwnerLastActive: true,
        isUpdatingOwnerLastActiveError: null,
      };
    case "UPDATE_LAST_ACTIVE_NOW_SUCCESS":
      return {
        ...state,
        isUpdatingOwnerLastActive: false,
        isUpdatingOwnerLastActiveError: null,
      };
    case "UPDATE_LAST_ACTIVE_NOW_FAIL":
      return {
        ...state,
        isUpdatingOwnerLastActive: false,
        isUpdatingOwnerLastActiveError: action.error,
      };

    // if the status changes when the gates are open
    // they need to be set to closed because when the owner
    // returns online the gates must be init to closed on all clients
    case "VISITOR_CENTER_STATUS":
      return {
        ...state,
        onlineStatus: action.onlineStatus,
        ...(action.onlineStatus === "offline" && {
          visitorCenterData: { ...state.visitorCenterData, gatesOpen: false },
        }),
      };

    case "RESET_VISITOR_CENTER":
      return { ...state, ...initialState };

    default:
      return state;
  }
};

export default visitorCenterReducer;
