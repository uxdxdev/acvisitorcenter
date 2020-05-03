import { useContext } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";
import { deleteUser, fetchVisitorCenterData } from "../../../actions";
import { QUEUE_LIMIT } from "../../../constants";

const useJoinQueue = (centerId) => {
  const context = useContext(store);
  const { dispatch, state } = context;
  const {
    auth: { uid },
    visitorCenter: {
      visitorCenterData: currentCenterData,
      onlineStatus,
      gatesOpen,
    },
    waitingList: { isJoiningQueue, isDeletingUser },
  } = state;

  const waitingList = currentCenterData?.waiting;
  const isVisitorCenterOpen = onlineStatus === "online" && gatesOpen;
  const isUserInQueue =
    waitingList && waitingList.filter((user) => user.uid === uid)?.length > 0;
  const isQueueFull = waitingList?.length >= QUEUE_LIMIT;
  const isJoinQueueEnabled =
    !isUserInQueue && isVisitorCenterOpen && !isQueueFull && !isJoiningQueue;

  const joinVisitorQueue = (centerId, name) => {
    if (!isUserInQueue && !isQueueFull) {
      const db = firebase.firestore();
      const centersRef = db.collection("centers").doc(centerId);

      dispatch({ type: "JOIN_QUEUE" });
      // when a user joins the queue set the dodo code to blank
      // this also removes the dodocode from the client
      // when a user joins the queue twice.
      dispatch({
        type: "FETCH_DODO_CODE_SUCCESS",
        dodoCode: "*****",
      });
      // run transaction to join center
      const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
      // server timestamp not currently supported in arrays 3.5.2020
      // const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      const userData = { name, uid, joinedAt };

      return db
        .runTransaction((transaction) => {
          return transaction.get(centersRef).then((snapshot) => {
            const waitingArray = snapshot.get("waiting");
            const participantsArray = snapshot.get("participants");

            waitingArray.push(userData);
            participantsArray.push(uid);

            transaction.update(centersRef, "waiting", waitingArray);
            transaction.update(centersRef, "participants", participantsArray);
          });
        })
        .then(() => {
          dispatch({
            type: "JOIN_QUEUE_SUCCESS",
          });

          fetchVisitorCenterData(dispatch, centerId);
        })
        .catch((error) => {
          dispatch({ type: "JOIN_QUEUE_FAIL", error });
        });
    }
  };

  const handleDeleteUser = (deleteUid) => {
    if (centerId && deleteUid) {
      deleteUser(dispatch, centerId, deleteUid);
    }
  };

  return {
    uid,
    handleDeleteUser,
    joinVisitorQueue,
    isUserInQueue,
    waitingList,
    isDeletingUser,
    isJoinQueueEnabled,
  };
};

export default useJoinQueue;
