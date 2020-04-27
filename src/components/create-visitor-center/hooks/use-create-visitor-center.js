import { useContext, useEffect, useCallback } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateVisitorCenter = () => {
  const context = useContext(store);
  const {
    state: {
      auth: { uid },
      visitorCenter: {
        isCreatingVisitorCenter,
        visitorCenterData,
        isFetchingVisitorCenterData,
      },
      dodoCode: { isUpdatingDodoCode },
    },
    dispatch,
  } = context;

  const isAuthed = uid !== null && uid !== undefined;
  const isLoading =
    !isAuthed ||
    isCreatingVisitorCenter ||
    isUpdatingDodoCode ||
    isFetchingVisitorCenterData;

  const updateUserData = async (dodoCode) => {
    if (uid && dodoCode) {
      const db = firebase.firestore();

      dispatch({ type: "UPDATE_DODO_CODE" });

      await db
        .collection("users")
        .doc(uid)
        .set({
          dodoCode,
          next: "",
        })
        .then(() => {
          dispatch({ type: "UPDATE_DODO_CODE_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "UPDATE_DODO_CODE_FAIL", error });
        });
    } else {
      dispatch({ type: "UPDATE_DODO_CODE_FAIL", error: "Invalid dodo code" });
    }
  };

  const createVisitorCenter = async (name, summary) => {
    if (uid && name && summary) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_VISITOR_CENTER" });

      await db
        .collection("centers")
        .doc(uid)
        .set({
          name,
          owner: uid,
          createdAt: timestamp(),
          waiting: [],
          summary,
        })
        .then(() => {
          dispatch({ type: "CREATE_VISITOR_CENTER_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error });
        });
    } else {
      dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error: "Invalid data" });
    }
  };

  const fetchVisitorCenterData = useCallback(() => {
    if (uid) {
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
            throw new Error("The user has not yet created a visitor center");
          }
        })
        .catch((error) => {
          dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
        });
    } else {
      dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error: "Invalid data" });
    }
  }, [uid, dispatch]);

  const handleCreateVisitorCenter = async (name, summary, dodoCode) => {
    await createVisitorCenter(name, summary);
    await updateUserData(dodoCode);
    await fetchVisitorCenterData();
  };

  useEffect(() => {
    isAuthed && fetchVisitorCenterData();
  }, [isAuthed, fetchVisitorCenterData]);

  return {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
  };
};

export default useCreateVisitorCenter;
