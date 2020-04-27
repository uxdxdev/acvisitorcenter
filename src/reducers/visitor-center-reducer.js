const initialState = {
  isCreatingCenter: false,
  centerId: null,
  createVisitorCenterError: null,
};

const visitorCenterReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_VISITOR_CENTER":
      return { ...state, isCreatingCenter: true };
    case "CREATE_VISITOR_CENTER_SUCCESS":
      return { ...state, isCreatingCenter: false, centerId: action.centerId };
    case "CREATE_VISITOR_CENTER_FAIL":
      return {
        ...state,
        isCreatingCenter: false,
        createVisitorCenterError: action.error,
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

    case "RESET_VISITOR_CENTER":
      return { ...state, ...initialState };

    default:
      return state;
  }
};

export default visitorCenterReducer;
