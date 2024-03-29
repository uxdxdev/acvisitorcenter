import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";
import {
  deleteUser,
  clearWaitingList,
  updateLastActiveNow,
} from "../../../actions";
import { setGatesOpen } from "../../../actions";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const { dispatch, state } = context;
  const {
    auth: { uid },
    visitorCenter: {
      visitorCenterData: currentCenterData,
      onlineStatus,
      gatesOpen,
      isUpdatingVisitorGateStatus,
    },
    waitingList: { isDeletingUser, isClearingWaitlist },
  } = state;

  const isOwner = centerId === uid;
  const waitingList = currentCenterData?.waiting;
  const isVisitorCenterOpen = onlineStatus === "online" && gatesOpen;
  const nextVisitorUid = waitingList && waitingList[0]?.uid;

  const toggleGates = () => {
    setGatesOpen(dispatch, centerId, !gatesOpen);
  };

  const setNextVisitor = useCallback(() => {
    const db = firebase.firestore();

    updateLastActiveNow(dispatch, centerId, "next visitor updated");

    dispatch({ type: "SET_NEXT_VISITOR" });

    db.collection("users")
      .doc(centerId)
      .set(
        {
          // set next visitor id to blank when waiting list empty
          next: nextVisitorUid || "",
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "SET_NEXT_VISITOR_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "SET_NEXT_VISITOR_FAIL", error });
      });
  }, [dispatch, centerId, nextVisitorUid]);

  useEffect(() => {
    if (isOwner) {
      setNextVisitor();
    }
  }, [setNextVisitor, isOwner]);

  const handleDeleteUser = (deleteUid) => {
    if (centerId && deleteUid) {
      deleteUser(dispatch, centerId, deleteUid);
    }
  };

  const handleClearWaitingList = () => {
    if (centerId) {
      clearWaitingList(dispatch, centerId);
    }
  };

  const listenVisitorCenterData = useCallback(() => {
    if (centerId) {
      const db = firebase.firestore();

      dispatch({ type: "LISTEN_VISITOR_CENTER_DATA" });

      return db
        .collection("centers")
        .doc(centerId)
        .onSnapshot(
          (result) => {
            // on page load the last active value is being updated
            // multiple times which sets hasPendingWrites true. Once
            // there are no more pending writes and last active is present
            // we update our data for each new snapshot update.
            const lastActive = result.data()?.lastActive;
            if (!result.metadata.hasPendingWrites || lastActive) {
              dispatch({
                type: "LISTEN_VISITOR_CENTER_DATA_SUCCESS",
                visitorCenterData: result.data(),
              });
            }
          },
          (error) => {
            dispatch({ type: "LISTEN_VISITOR_CENTER_DATA_FAIL", error });
          }
        );
    }
  }, [centerId, dispatch]);

  /**
   * Fetch center data when user authenticated.
   */
  useEffect(() => {
    const unsubscribe = listenVisitorCenterData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [listenVisitorCenterData]);

  return {
    handleDeleteUser,
    handleClearWaitingList,
    isOwner,
    isVisitorCenterOpen,
    waitingList,
    toggleGates,
    gatesOpen,
    isDeletingUser,
    isClearingWaitlist,
    isUpdatingVisitorGateStatus,
  };
};

export default useVisitorCenter;
