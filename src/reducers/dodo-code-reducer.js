const initialState = {
  isFetchingDodoCode: false,
  code: null,
  isFetchingDodoCodeError: null,
};

const dodoCodeReducer = (state, action) => {
  switch (action.type) {
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
        code: action.dodoCode,
        isFetchingDodoCodeError: null,
      };
    case "FETCH_DODO_CODE_FAIL":
      return {
        ...state,
        isFetchingDodoCode: false,
        isFetchingDodoCodeError: action.error,
      };

    case "UPDATE_DODO_CODE":
      return {
        ...state,
        isUpdatingDodoCode: true,
        isUpdatingDodoCodeError: null,
      };
    case "UPDATE_DODO_CODE_SUCCESS":
      return {
        ...state,
        isUpdatingDodoCode: false,
        isUpdatingDodoCodeError: null,
      };
    case "UPDATE_DODO_CODE_FAIL":
      return {
        ...state,
        isUpdatingDodoCode: false,
        isUpdatingDodoCodeError: action.error,
      };
    case "SET_DODO_CODE":
      return {
        ...state,
        isSettingDodoCode: true,
        isSettingDodoCodeError: null,
      };
    case "SET_DODO_CODE_SUCCESS":
      return {
        ...state,
        isSettingDodoCode: false,
        isSettingDodoCodeError: null,
      };
    case "SET_DODO_CODE_FAIL":
      return {
        ...state,
        isSettingDodoCode: false,
        isSettingDodoCodeError: action.error,
      };

    case "RESET_FETCH_DODO_CODE":
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
};

export default dodoCodeReducer;
