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
      isUpdatingVisitorGateStatus,
    },
    waitingList: { isDeletingUser, isClearingWaitlist },
  } = state;

  const isOwner = centerId === uid;
  const waitingList = currentCenterData?.waiting;
  const gatesOpen = currentCenterData?.gatesOpen;

  const isVisitorCenterOpen = onlineStatus === "online" && gatesOpen;

  const nextVisitorUid = waitingList && waitingList[0]?.uid;

  const toggleGates = () => {
    setGatesOpen(dispatch, centerId, !gatesOpen);
  };

  const setNextVisitor = useCallback(() => {
    if (nextVisitorUid) {
      const db = firebase.firestore();

      updateLastActiveNow(dispatch, centerId);

      dispatch({ type: "SET_NEXT_VISITOR" });

      db.collection("users")
        .doc(centerId)
        .set(
          {
            next: nextVisitorUid,
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "SET_NEXT_VISITOR_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "SET_NEXT_VISITOR_FAIL", error });
        });
    }
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
