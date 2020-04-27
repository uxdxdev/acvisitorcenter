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
  const newState = {
    auth: authReducer(auth, action),
    dodoCode: dodoCodeReducer(dodoCode, action),
    visitorCenter: visitorCenterReducer(visitorCenter, action),
    waitingList: waitingListReducer(waitingList, action),
  };
  if (process.env.NODE_ENV === "development") {
    console.log("ACTION:", action);
    console.log("STATE:", newState);
  }
  return newState;
};

export { rootReducer, initialState };
