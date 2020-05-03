import { useContext } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";
import { deleteUser, fetchVisitorCenterData } from "../../../actions";

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

  const isQueueFull = waitingList?.length >= 20;

  const joinVisitorQueue = (centerId, name) => {
    if (!isUserInQueue && !isQueueFull) {
      const db = firebase.firestore();
      const centersRef = db.collection("centers").doc(centerId);

      dispatch({ type: "JOIN_QUEUE" });

      // run transaction to join center
      db.runTransaction((transaction) => {
        return transaction.get(centersRef).then((snapshot) => {
          const waitingArray = snapshot.get("waiting");
          const participantsArray = snapshot.get("participants");

          const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
          const userData = { name, uid, joinedAt };
          waitingArray.push(userData);
          participantsArray.push(uid);

          transaction.update(centersRef, "waiting", waitingArray);
          transaction.update(centersRef, "participants", participantsArray);
        });
      })
        .then(() => {
          dispatch({ type: "JOIN_QUEUE_SUCCESS" });
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
    isVisitorCenterOpen,
    isUserInQueue,
    waitingList,
    isJoiningQueue,
    isDeletingUser,
  };
};

export default useJoinQueue;
