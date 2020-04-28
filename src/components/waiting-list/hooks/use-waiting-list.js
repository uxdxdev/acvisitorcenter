import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

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

  const deleteUser = (id, deleteUid) => {
    const db = firebase.firestore();
    const centersRef = db.collection("centers").doc(id);

    dispatch({ type: "DELETE_USER" });

    // run transaction to join center
    return db
      .runTransaction((transaction) => {
        return transaction.get(centersRef).then((snapshot) => {
          let waitingArray = snapshot.get("waiting");
          waitingArray = waitingArray.filter((user) => user.uid !== deleteUid);
          transaction.update(centersRef, "waiting", waitingArray);
        });
      })
      .then(() => {
        dispatch({ type: "DELETE_USER_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "DELETE_USER_FAIL", error });
      });
  };

  const joinVisitorQueue = (centerId, name) => {
    if (!userAlreadyInQueue) {
      const db = firebase.firestore();
      const centersRef = db.collection("centers").doc(centerId);

      dispatch({ type: "JOIN_QUEUE" });

      // run transaction to join center
      db.runTransaction((transaction) => {
        return transaction.get(centersRef).then((snapshot) => {
          const waitingArray = snapshot.get("waiting");
          const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
          waitingArray.push({ name, uid, joinedAt });
          transaction.update(centersRef, "waiting", waitingArray);
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

  return {
    deleteUser,
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
    isVisitorCenterOpen,
    userAlreadyInQueue,
  };
};

export default useVisitorCenter;
