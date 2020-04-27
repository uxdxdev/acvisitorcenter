const initialState = {
  isCreatingVisitorCenter: false,
  centerId: null,
  createVisitorCenterError: null,
};

const visitorCenterReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_VISITOR_CENTER":
      return { ...state, isCreatingVisitorCenter: true };
    case "CREATE_VISITOR_CENTER_SUCCESS":
      return {
        ...state,
        isCreatingVisitorCenter: false,
        centerId: action.centerId,
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
        visitorCenterData: action.data,
        isFetchingVisitorCenterDataError: null,
      };
    case "FETCH_VISITOR_CENTER_FAIL":
      return {
        ...state,
        isFetchingVisitorCenterData: false,
        visitorCenterData: null,
        isFetchingVisitorCenterDataError: action.error,
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
