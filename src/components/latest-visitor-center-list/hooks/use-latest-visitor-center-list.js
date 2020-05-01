import { useEffect, useContext, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useLatestVisitorCenterList = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      visitorCenter: { latestCenters, isFetchingLatestCenters },
    },
  } = context;

  const isLoading = isFetchingLatestCenters || latestCenters === undefined;

  const fetchLatestCenters = useCallback(() => {
    const db = firebase.firestore();

    dispatch({ type: "LISTEN_LATEST_CENTERS" });

    return db
      .collection("centers")
      .orderBy("lastActive", "desc")
      .orderBy("waiting", "asc")
      .limit(10)
      .onSnapshot((latestCenters) => {
        const data = latestCenters.docs.map((doc) => ({
          ...doc.data(),
        }));
        dispatch({
          type: "LISTEN_LATEST_CENTERS_SUCCESS",
          latestCenters: data,
        });
      });
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = fetchLatestCenters();
    return () => {
      unsubscribe();
    };
  }, [dispatch, fetchLatestCenters]);

  return { latestCenters, isLoading };
};

export default useLatestVisitorCenterList;
