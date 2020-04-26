import { useContext, useEffect, useCallback } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateVisitorCenter = () => {
  const context = useContext(store);
  const {
    state: {
      uid,
      isCreatingCenter,
      visitorCenterData,
      isFetchingVisitorCenter,
    },
    dispatch,
  } = context;

  const createVisitorCenter = (name, summary, code) => {
    if (uid && name && summary && code) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_CENTER" });

      // add document to collection
      db.collection("centers")
        .doc(uid)
        .set({
          name,
          owner: uid,
          createdAt: timestamp(),
          waiting: [],
          summary,
        })
        .then(() => {
          dispatch({ type: "CREATE_CENTER_SUCCESS", centerId: uid });

          // update user data with dodo code
          db.collection("users")
            .doc(uid)
            .set({
              dodoCode: code,
              next: "",
            })
            .then(() => {
              // success
              console.log("updated user data with dodo code");
              fetchVisitorCenter(uid);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          dispatch({ type: "CREATE_CENTER_FAIL", error });
        });
    } else {
      console.log("invalid data", uid, name, summary, code);
    }
  };

  /**
   * Fetch center data from firestore.
   */
  const fetchVisitorCenter = useCallback(
    (uid) => {
      dispatch({ type: "FETCH_VISITOR_CENTER" });

      return firebase
        .firestore()
        .collection("centers")
        .doc(uid)
        .get()
        .then((result) => {
          if (result.exists) {
            dispatch({
              type: "FETCH_VISITOR_CENTER_SUCCESS",
              data: result.data(),
            });
          } else {
            throw new Error("visitor center does not exist");
          }
        })
        .catch((error) => {
          dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
        });
    },
    [dispatch]
  );

  useEffect(() => {
    uid && fetchVisitorCenter(uid);
  }, [uid, fetchVisitorCenter]);

  return {
    createVisitorCenter,
    isCreatingCenter,
    visitorCenterData,
    isFetchingVisitorCenter,
  };
};

export default useCreateVisitorCenter;
