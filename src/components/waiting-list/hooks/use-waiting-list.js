import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";
import { deleteUser } from "../../../actions";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
      visitorCenter: { visitorCenterData: currentCenterData, onlineStatus },
      waitingList: { isJoiningQueue },
    },
  } = context;

  // const waitingList = currentCenterData?.waiting;
  const isOwner = centerId === uid;
  const waitingList = currentCenterData?.waiting;
  const isVisitorCenterOpen = onlineStatus === "online";
  const userAlreadyInQueue =
    waitingList && waitingList.filter((user) => user.uid === uid)?.length > 0;

  const setNextVisitor = useCallback(
    (nextVisitorUid) => {
      const db = firebase.firestore();

      dispatch({ type: "SET_NEXT_VISITOR" });

      centerId &&
        db
          .collection("users")
          .doc(centerId)
          .set(
            {
              next: nextVisitorUid,
            },
            { merge: true }
          )
          .then(() => {
            dispatch({ type: "SET_NEXT_VISITOR_SUCCESS" });
          })
          .catch((error) => {
            dispatch({ type: "SET_NEXT_VISITOR_FAIL", error });
          });
    },
    [dispatch, centerId]
  );

  useEffect(() => {
    // if there is a change in the waiting list
    // then update the next visitor
    if (isOwner && waitingList?.length > 0) {
      const nextVisitorUid = waitingList[0]?.uid || "";
      setNextVisitor(nextVisitorUid);
    }
  }, [waitingList, setNextVisitor, isOwner]);

  const joinVisitorQueue = (centerId, name) => {
    if (!userAlreadyInQueue) {
      const db = firebase.firestore();
      const centersRef = db.collection("centers").doc(centerId);

      dispatch({ type: "JOIN_QUEUE" });

      // run transaction to join center
      db.runTransaction((transaction) => {
        return transaction.get(centersRef).then((snapshot) => {
          const waitingArray = snapshot.get("waiting");
          const participantsArray = snapshot.get("participants");

          const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
          waitingArray.push({ name, uid, joinedAt });
          participantsArray.push(uid);

          transaction.update(centersRef, "waiting", waitingArray);
          transaction.update(centersRef, "participants", participantsArray);
        });
      })
        .then(() => {
          dispatch({ type: "JOIN_QUEUE_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "JOIN_QUEUE_FAIL", error });
        });
    }
  };

  const handleDeleteUser = (centerId, deleteUid) => {
    if (centerId && deleteUid) {
      deleteUser(dispatch, centerId, deleteUid);
    }
  };

  return {
    uid,
    waitingList,
    handleDeleteUser,
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
    isVisitorCenterOpen,
    userAlreadyInQueue,
  };
};

export default useVisitorCenter;
