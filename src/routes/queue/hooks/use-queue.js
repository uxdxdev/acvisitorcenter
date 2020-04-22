import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useQueue = (queueId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, isJoiningQueue, queueData },
  } = context;

  /**
   * Fetch queue data from firestore.
   */
  const fetchQueueData = useCallback(
    (id) => {
      dispatch({ type: "FETCH_QUEUE_DATA" });

      return firebase
        .firestore()
        .collection("queues")
        .doc(id)
        .get()
        .then((result) => {
          dispatch({
            type: "FETCH_QUEUE_DATA_SUCCESS",
            queueData: result.data(),
          });
        })
        .catch((error) => {
          dispatch({ type: "FETCH_QUEUE_DATA_FAIL" });
        });
    },
    [dispatch]
  );

  /**
   * Fetch queue data when user authenticated.
   */
  useEffect(() => {
    fetchQueueData(queueId);
  }, [uid, fetchQueueData, queueId]);

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
        waitingArray.push({ name, uid });
        transaction.update(queuesRef, "waiting", waitingArray);
      });
    })
      .then(() => {
        dispatch({ type: "JOIN_QUEUE_SUCCESS" });
        // fetch latest queue data when joined
        fetchQueueData(id);
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

    dispatch({ type: "JOIN_QUEUE" });

    // run transaction to join queue
    db.runTransaction((transaction) => {
      return transaction.get(queuesRef).then((snapshot) => {
        let waitingArray = snapshot.get("waiting");
        waitingArray = waitingArray.filter((user) => user.uid !== deleteUid);
        console.log(waitingArray);
        transaction.update(queuesRef, "waiting", waitingArray);
      });
    })
      .then(() => {
        dispatch({ type: "JOIN_QUEUE_SUCCESS" });
        // fetch latest queue data when joined
        fetchQueueData(id);
      })
      .catch((error) => {
        dispatch({ type: "JOIN_QUEUE_FAIL", error });
      });
  };

  return {
    uid,
    isJoiningQueue,
    queueData,
    fetchQueueData,
    joinQueue,
    deleteUser,
  };
};

export default useQueue;
