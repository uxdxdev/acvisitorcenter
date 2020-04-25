import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useQueue = (queueId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, isJoiningQueue, queueData, dodoCode },
  } = context;

  const ownerUid = queueData?.owner;
  const isOwner = ownerUid === uid;

  const setNextVisitor = useCallback(
    (nextVisitorUid) => {
      const db = firebase.firestore();

      uid &&
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
    [uid]
  );

  const fetchQueueData = useCallback(() => {
    if (uid && queueId) {
      dispatch({ type: "FETCH_QUEUE_DATA" });
      const db = firebase.firestore();

      return db
        .collection("queues")
        .doc(queueId)
        .onSnapshot(
          (result) => {
            dispatch({
              type: "FETCH_QUEUE_DATA_SUCCESS",
              queueData: result.data(),
            });

            // update the next visitor uid
            if (result.data()?.owner === uid) {
              const nextVisitorUid = result.data()?.waiting[0]?.uid || "";
              setNextVisitor(nextVisitorUid);
            }
          },
          (error) => {
            dispatch({ type: "FETCH_QUEUE_DATA_FAIL", error });
          }
        );
    }
  }, [uid, queueId, dispatch, setNextVisitor]);

  /**
   * Fetch queue data when user authenticated.
   */
  useEffect(() => {
    const unsubscribe = fetchQueueData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [fetchQueueData]);

  /**
   * Join visitor queue.
   *
   * @param {*} id queue id
   * @param {*} data.name visitor center name
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
   * @param {*} data.name visitor center name
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
  const fetchDodoCode = () => {
    const isFirstInQueue = queueData?.waiting[0]?.uid === uid;
    if ((isOwner || isFirstInQueue) && ownerUid) {
      dispatch({ type: "FETCH_ISLAND_CODE" });

      return firebase
        .firestore()
        .collection("users")
        .doc(ownerUid)
        .get()
        .then((result) => {
          const { dodoCode } = result.data();
          dispatch({ type: "FETCH_ISLAND_CODE_SUCCESS", dodoCode });
        })
        .catch((error) => {
          dispatch({ type: "FETCH_ISLAND_CODE_FAIL", error });
        });
    } else {
      dispatch({ type: "FETCH_ISLAND_CODE_FAIL" });
    }
  };

  return {
    isOwner,
    isJoiningQueue,
    queueData,
    joinQueue,
    deleteUser,
    dodoCode,
    fetchDodoCode,
  };
};

export default useQueue;
