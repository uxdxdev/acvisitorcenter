const initialState = {
  isFetchingDodoCode: false,
  isFetchingDodoCodeError: null,
  code: null,

  isUpdatingDodoCode: false,
  isUpdatingDodoCodeError: null,
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
        code: action.dodoCode,
        isUpdatingDodoCodeError: null,
      };
    case "UPDATE_DODO_CODE_FAIL":
      return {
        ...state,
        isUpdatingDodoCode: false,
        isUpdatingDodoCodeError: action.error,
      };

    case "RESET_DODO_CODE":
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
};

export default dodoCodeReducer;
