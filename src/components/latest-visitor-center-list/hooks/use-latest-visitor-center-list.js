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

    dispatch({ type: "FETCH_LATEST_CENTERS" });

    return db
      .collection("centers")
      .orderBy("lastActive", "desc")
      .orderBy("waiting", "asc")
      .limit(5)
      .get()
      .then((latestCenters) => {
        const data = latestCenters.docs.map((doc) => ({
          ...doc.data(),
        }));
        dispatch({
          type: "FETCH_LATEST_CENTERS_SUCCESS",
          latestCenters: data,
        });
      });
  }, [dispatch]);

  useEffect(() => {
    fetchLatestCenters();
  }, [dispatch, fetchLatestCenters]);

  return { latestCenters, isLoading };
};

export default useLatestVisitorCenterList;
