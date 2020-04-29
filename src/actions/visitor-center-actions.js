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
