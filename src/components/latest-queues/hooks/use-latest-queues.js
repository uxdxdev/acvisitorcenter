import { useEffect, useContext, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useLatestQueues = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, latestQueues, isFetchingLatestQueues },
  } = context;

  const fetchLatestQueues = useCallback(() => {
    dispatch({ type: "FETCH_LATEST_QUEUES" });

    return firebase
      .firestore()
      .collection("queues")
      .orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot((latestQueues) => {
        const data = latestQueues.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({
          type: "FETCH_LATEST_QUEUES_SUCCESS",
          latestQueues: data,
        });
      });
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = uid && fetchLatestQueues();
    return () => {
      uid && unsubscribe();
    };
  }, [uid, dispatch, fetchLatestQueues]);

  return { latestQueues, isFetchingLatestQueues, fetchLatestQueues };
};

export default useLatestQueues;
