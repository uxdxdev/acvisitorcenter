import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useQueue = (queueId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, isJoiningQueue, queueData, islandCode },
  } = context;

  const ownerUid = queueData?.owner;
  const isOwner = ownerUid === uid;
  const isFirstInQueue = queueData?.waiting[0]?.uid === uid;

  const setNextVisitor = useCallback(
    (nextVisitorUid) => {
      const db = firebase.firestore();

      // only queue owners can update the next visitor uid
      isOwner &&
        db
          .collection("users")
          .doc(uid)
          .set(
            {
              next: nextVisitorUid,
            },
            { merge: true }
          )
          .then(() => {
            // success
          })
          .catch((error) => {
            console.log("updating next visitor failed", error);
          });
    },
    [isOwner, uid]
  );

  const fetchQueueData = useCallback(
    (id) => {
      const db = firebase.firestore();
      dispatch({ type: "FETCH_QUEUE_DATA" });

      return db
        .collection("queues")
        .doc(id)
        .onSnapshot((result) => {
          dispatch({
            type: "FETCH_QUEUE_DATA_SUCCESS",
            queueData: result.data(),
          });

          // update the next visitor id
          if (isOwner) {
            const nextVisitorUid = result.data()?.waiting[0]?.uid || "";
            setNextVisitor(nextVisitorUid);
          }
        });
    },
    [isOwner, setNextVisitor, dispatch]
  );

  /**
   * Fetch queue data when user authenticated.
   */
  useEffect(() => {
    const unsubscribe = fetchQueueData(queueId);
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [fetchQueueData, queueId]);

  /**
   * Join visitor queue.
   *
   * @param {*} id queue id
   * @param {*} data.name island name
   * @param {*} data.uid user id
   */
  const joinQueue = (id, { name, uid }) => {
    const db = firebase.firestore();
    const queuesRef = db.collection("queues").doc(id);

    dispatch({ type: "JOIN_QUEUE" });

    // run transaction to join queue
    db.runTransaction((transaction) => {
      return transaction.get(queuesRef).then((snapshot) => {
        const waitingArray = snapshot.get("waiting");
        const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
        waitingArray.push({ name, uid, joinedAt });
        transaction.update(queuesRef, "waiting", waitingArray);
      });
    })
      .then(() => {
        dispatch({ type: "JOIN_QUEUE_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "JOIN_QUEUE_FAIL", error });
      });
  };

  /**
   * Join visitor queue.
   *
   * @param {*} id queue id
   * @param {*} data.name island name
   * @param {*} data.uid user id
   */
  const deleteUser = (id, deleteUid) => {
    const db = firebase.firestore();
    const queuesRef = db.collection("queues").doc(id);

    dispatch({ type: "DELETE_USER" });

    // run transaction to join queue
    return db
      .runTransaction((transaction) => {
        return transaction.get(queuesRef).then((snapshot) => {
          let waitingArray = snapshot.get("waiting");
          waitingArray = waitingArray.filter((user) => user.uid !== deleteUid);
          transaction.update(queuesRef, "waiting", waitingArray);
        });
      })
      .then(() => {
        dispatch({ type: "DELETE_USER_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "DELETE_USER_FAIL", error });
      });
  };

  /**
   * Fetch queue data from firestore.
   */
  const fetchIslandCode = useCallback(
    (id) => {
      dispatch({ type: "FETCH_ISLAND_CODE" });

      return firebase
        .firestore()
        .collection("users")
        .doc(id)
        .onSnapshot(
          (result) => {
            const { islandCode } = result.data();

            dispatch({ type: "FETCH_ISLAND_CODE_SUCCESS", islandCode });
          },
          (error) => {
            console.log("failed to get island code");
            dispatch({ type: "FETCH_ISLAND_CODE_FAIL", error });
          }
        );
    },
    [dispatch]
  );

  useEffect(() => {
    console.log(isOwner, isFirstInQueue, ownerUid);
    const unsubscribe =
      (isOwner || isFirstInQueue) && ownerUid && fetchIslandCode(ownerUid);
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [fetchIslandCode, ownerUid, isOwner, isFirstInQueue]);

  return {
    uid,
    isOwner,
    isJoiningQueue,
    queueData,
    joinQueue,
    deleteUser,
    islandCode,
    setNextVisitor,
  };
};

export default useQueue;
