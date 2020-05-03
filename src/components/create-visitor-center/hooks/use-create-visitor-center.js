import { useContext, useEffect } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";
import { fetchVisitorCenterData } from "../../../actions";

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

  const initUserData = () => {
    const db = firebase.firestore();

    dispatch({ type: "UPDATE_DODO_CODE" });

    const dodoCode = "00000";

    db.collection("users")
      .doc(uid)
      .set({
        dodoCode,
        next: "",
      })
      .then(() => {
        dispatch({ type: "UPDATE_DODO_CODE_SUCCESS", dodoCode });
      })
      .catch((error) => {
        dispatch({ type: "UPDATE_DODO_CODE_FAIL", error });
      });
  };

  const createVisitorCenter = (name, summary) => {
    if (name && summary) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_VISITOR_CENTER" });

      const visitorCenterData = {
        name,
        owner: uid,
        createdAt: timestamp(),
        waiting: [],
        participants: [],
        summary,
        lastActive: timestamp(),
      };
      db.collection("centers")
        .doc(uid)
        .set(visitorCenterData)
        .then(() => {
          dispatch({
            type: "CREATE_VISITOR_CENTER_SUCCESS",
            visitorCenterData,
          });
        })
        .catch((error) => {
          dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error });
        });
    } else {
      dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error: "Invalid data" });
    }
  };

  const handleCreateVisitorCenter = async (name, summary) => {
    await createVisitorCenter(name, summary);
    await initUserData();
  };

  useEffect(() => {
    fetchVisitorCenterData(dispatch, uid);
    return () => {
      dispatch({ type: "RESET_VISITOR_CENTER" });
    };
  }, [dispatch, uid]);

  return {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
    isCreatingVisitorCenterPending,
  };
};

export default useCreateVisitorCenter;
