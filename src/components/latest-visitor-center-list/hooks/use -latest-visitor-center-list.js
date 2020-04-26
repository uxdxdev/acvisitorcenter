import { useEffect, useContext, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useLatestVisitorCenterList = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, latestCenters, isFetchingLatestCenters },
  } = context;

  const fetchLatestCenters = useCallback(() => {
    const db = firebase.firestore();

    dispatch({ type: "LISTEN_LATEST_CENTERS" });

    return db
      .collection("centers")
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((latestCenters) => {
        const data = latestCenters.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({
          type: "LISTEN_LATEST_CENTERS_SUCCESS",
          latestCenters: data,
        });
      });
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = uid && fetchLatestCenters();
    return () => {
      uid && unsubscribe();
    };
  }, [uid, dispatch, fetchLatestCenters]);

  return { latestCenters, isFetchingLatestCenters };
};

export default useLatestVisitorCenterList;
