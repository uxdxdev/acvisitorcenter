import dodoCodeReducer from "./dodo-code-reducer";
import authReducer from "./auth-reducer";
import visitorCenterReducer from "./visitor-center-reducer";
import waitingListReducer from "./waiting-list-reducer";

const initialState = {
  auth: {},
  dodoCode: {},
  visitorCenter: {},
  waitingList: {},
};

const rootReducer = (state, action) => {
  const { auth, dodoCode, visitorCenter, waitingList } = state;
  if (process.env.NODE_ENV === "development") {
    console.log("ACTION:", action);
  }
  return {
    auth: authReducer(auth, action),
    dodoCode: dodoCodeReducer(dodoCode, action),
    visitorCenter: visitorCenterReducer(visitorCenter, action),
    waitingList: waitingListReducer(waitingList, action),
  };
};

export { rootReducer, initialState };
