import { firebase } from "../utils/firebase";

export const deleteUser = (dispatch, centerId, deleteUid) => {
  const db = firebase.firestore();
  const centersRef = db.collection("centers").doc(centerId);

  dispatch({ type: "DELETE_USER" });

  // run transaction to join center
  return db
    .runTransaction((transaction) => {
      return transaction.get(centersRef).then((snapshot) => {
        let waitingArray = snapshot.get("waiting");
        let participantsArray = snapshot.get("participants");

        waitingArray = waitingArray.filter((user) => user.uid !== deleteUid);
        participantsArray = participantsArray.filter(
          (uid) => uid !== deleteUid
        );

        transaction.update(centersRef, "waiting", waitingArray);
        transaction.update(centersRef, "participants", participantsArray);
      });
    })
    .then(() => {
      dispatch({ type: "DELETE_USER_SUCCESS" });
    })
    .catch((error) => {
      dispatch({ type: "DELETE_USER_FAIL", error });
    });
};
