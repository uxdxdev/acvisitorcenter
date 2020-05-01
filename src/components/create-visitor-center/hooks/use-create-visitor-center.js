import { useContext, useEffect, useCallback } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateVisitorCenter = () => {
  const context = useContext(store);
  const {
    state: {
      auth: { uid },
      visitorCenter: {
        visitorCenterData,
        isFetchingVisitorCenterData,
        isCreatingVisitorCenter,
      },
      dodoCode: { isUpdatingDodoCode },
    },
    dispatch,
  } = context;

  const isLoading =
    isFetchingVisitorCenterData || visitorCenterData === undefined;

  const isCreatingVisitorCenterPending =
    isCreatingVisitorCenter ||
    isUpdatingDodoCode ||
    isFetchingVisitorCenterData;

  const updateUserData = async (dodoCode) => {
    const db = firebase.firestore();

    dispatch({ type: "UPDATE_DODO_CODE" });

    await db
      .collection("users")
      .doc(uid)
      .set({
        dodoCode: dodoCode || "00000",
        next: "",
      })
      .then(() => {
        dispatch({ type: "UPDATE_DODO_CODE_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "UPDATE_DODO_CODE_FAIL", error });
      });
  };

  const createVisitorCenter = async (name, summary) => {
    if (name && summary) {
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
          participants: [],
          summary,
          gatesOpen: false,
          lastActive: timestamp(),
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
            visitorCenterData: result.data(),
          });
        } else {
          dispatch({
            type: "FETCH_VISITOR_CENTER_FAIL",
            error: "The user has not yet created a visitor center",
          });
        }
      })
      .catch((error) => {
        dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
      });
  }, [uid, dispatch]);

  const handleCreateVisitorCenter = async (name, summary, dodoCode) => {
    await createVisitorCenter(name, summary);
    await updateUserData(dodoCode);
    await fetchVisitorCenterData();
  };

  useEffect(() => {
    fetchVisitorCenterData();
  }, [dispatch, fetchVisitorCenterData]);

  return {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
    isCreatingVisitorCenterPending,
  };
};

export default useCreateVisitorCenter;
