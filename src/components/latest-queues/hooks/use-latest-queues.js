import { useEffect, useContext, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useLatestQueues = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: { latestQueues, isFetchingLatestQueues },
  } = context;

  const fetchLatestQueues = useCallback(() => {
    dispatch({ type: "FETCH_LATEST_QUEUES" });

    firebase
      .firestore()
      .collection("queues")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get()
      .then((latestQueues) => {
        const data = latestQueues.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({
          type: "FETCH_LATEST_QUEUES_SUCCESS",
          latestQueues: data,
        });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_LATEST_QUEUES_FAIL", error });
      });
  }, [dispatch]);

  useEffect(() => {
    fetchLatestQueues();
  }, [dispatch, fetchLatestQueues]);

  return { latestQueues, isFetchingLatestQueues, fetchLatestQueues };
};

export default useLatestQueues;
