import { firebase } from "../utils/firebase";

export const setGatesOpen = (dispatch, centerId, gatesOpen) => {
  firebase
    .database()
    .ref("users/" + centerId)
    .update({
      gatesOpen,
    })
    .then(() => {
      // dispatch({ type: "SET_GATES_OPEN_STATUS_SUCCESS" });
    })
    .catch((error) => {
      // dispatch({ type: "SET_GATES_OPEN_STATUS_FAIL", error });
    });
};

export const updateLastActiveNow = (dispatch, centerId, event) => {
  const db = firebase.firestore();

  dispatch({ type: "UPDATE_LAST_ACTIVE_NOW", event });

  const lastActive = firebase.firestore.FieldValue.serverTimestamp;
  const lastActiveResult = lastActive();
  db.collection("centers")
    .doc(centerId)
    .set(
      {
        lastActive: lastActiveResult,
      },
      { merge: true }
    )
    .then(() => {
      dispatch({ type: "UPDATE_LAST_ACTIVE_NOW_SUCCESS" });
    })
    .catch((error) => {
      dispatch({ type: "UPDATE_LAST_ACTIVE_NOW_FAIL", error });
    });
};

export const fetchVisitorCenterData = (dispatch, centerId) => {
  dispatch({ type: "FETCH_VISITOR_CENTER_DATA" });

  return firebase
    .firestore()
    .collection("centers")
    .doc(centerId)
    .get()
    .then((result) => {
      if (result.exists) {
        dispatch({
          type: "FETCH_VISITOR_CENTER_DATA_SUCCESS",
          visitorCenterData: result.data(),
        });
      } else {
        dispatch({
          type: "FETCH_VISITOR_CENTER_DATA_FAIL",
          error: "The user has not yet created a visitor center",
        });
      }
    })
    .catch((error) => {
      dispatch({ type: "FETCH_VISITOR_CENTER_DATA_FAIL", error });
    });
};
