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
      };
    case "CREATE_VISITOR_CENTER_FAIL":
      return {
        ...state,
        isCreatingVisitorCenter: false,
        createVisitorCenterError: action.error,
      };

    case "FETCH_VISITOR_CENTER":
      return {
        ...state,
        isFetchingVisitorCenterData: true,
        isFetchingVisitorCenterDataError: null,
      };
    case "FETCH_VISITOR_CENTER_SUCCESS":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: action.visitorCenterData,
        isFetchingVisitorCenterDataError: null,
      };
    case "FETCH_VISITOR_CENTER_FAIL":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: null,
        isFetchingVisitorCenterDataError: action.error,
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

    case "VISITOR_CENTER_STATUS":
      return { ...state, onlineStatus: action.onlineStatus };

    case "RESET_VISITOR_CENTER":
      return { ...state, ...initialState };

    default:
      return state;
  }
};

export default visitorCenterReducer;
