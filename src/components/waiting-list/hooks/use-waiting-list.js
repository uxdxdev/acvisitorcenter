import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
      visitorCenter: { visitorCenterData: currentCenterData },
      waitingList: { isJoiningQueue },
    },
  } = context;

  // const waitingList = currentCenterData?.waiting;
  const ownerUid = currentCenterData?.owner;
  const isOwner = ownerUid && uid && ownerUid === uid;

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
    // update the next visitor uid
    if (
      currentCenterData?.owner === uid &&
      currentCenterData?.waiting.length > 0
    ) {
      const nextVisitorUid = currentCenterData?.waiting[0]?.uid || "";
      setNextVisitor(nextVisitorUid);
    }
  }, [currentCenterData, setNextVisitor, uid]);

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
  };

  return {
    uid,
    deleteUser,
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
  };
};

export default useVisitorCenter;
