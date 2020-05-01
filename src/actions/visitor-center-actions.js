import { firebase } from "../utils/firebase";

export const setGatesOpen = (dispatch, centerId, gatesOpen) => {
  const db = firebase.firestore();

  dispatch({ type: "SET_GATES_OPEN_STATUS" });

  db.collection("centers")
    .doc(centerId)
    .set(
      {
        gatesOpen,
      },
      { merge: true }
    )

    .then(() => {
      dispatch({ type: "SET_GATES_OPEN_STATUS_SUCCESS" });
    })
    .catch((error) => {
      dispatch({ type: "SET_GATES_OPEN_STATUS_FAIL", error });
    });
};

export const updateLastActiveNow = (dispatch, centerId) => {
  const db = firebase.firestore();

  dispatch({ type: "UPDATE_LAST_ACTIVE_NOW" });
  const lastActive = firebase.firestore.FieldValue.serverTimestamp;

  db.collection("centers")
    .doc(centerId)
    .set(
      {
        lastActive: lastActive(),
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
