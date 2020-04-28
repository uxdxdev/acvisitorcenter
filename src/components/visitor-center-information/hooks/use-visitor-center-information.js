import { useContext, useEffect, useState, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
      visitorCenter: {
        visitorCenterData,
        onlineStatus,
        isFetchingVisitorCenterData,
      },
      dodoCode: { code: currentDodoCode },
    },
  } = context;

  const waitingList = visitorCenterData?.waiting;
  const ownerUid = visitorCenterData?.owner;

  const isOwner = uid === centerId;
  const isUserFirstInQueue = waitingList && waitingList[0]?.uid === uid;
  const isVisitorCenterOpen = onlineStatus === "online";
  const isLoading =
    isFetchingVisitorCenterData || visitorCenterData === undefined;

  const handleFetchDodoCode = () => {
    if ((isOwner || isUserFirstInQueue) && ownerUid) {
      dispatch({ type: "FETCH_DODO_CODE" });

      return firebase
        .firestore()
        .collection("users")
        .doc(ownerUid)
        .get()
        .then((result) => {
          const { dodoCode } = result.data();
          dispatch({ type: "FETCH_DODO_CODE_SUCCESS", dodoCode });
        })
        .catch((error) => {
          dispatch({
            type: "FETCH_DODO_CODE_FAIL",
            error:
              "User is not owner, first in the queue, or the visitor center is closed",
          });
        });
    } else {
      dispatch({
        type: "FETCH_DODO_CODE_FAIL",
        error:
          "User is not owner, first in the queue, or the visitor center is closed",
      });
    }
  };

  const [updatedVisitorCenterData, setVisitorCenterData] = useState({
    name: "Loading...",
    summary: "Loading...",
    dodoCode: "*****",
  });

  useEffect(() => {
    visitorCenterData &&
      setVisitorCenterData({
        ...visitorCenterData,
        dodoCode: currentDodoCode || "*****",
      });
  }, [visitorCenterData, currentDodoCode]);

  const handleCenterInformationChange = (id, value) => {
    setVisitorCenterData((currentState) => {
      return { ...currentState, ...{ [id]: value } };
    });
  };

  const [isEditable, setIsEditable] = useState({});

  const handleEditSaveData = (key) => {
    setIsEditable((currentState) => {
      return {
        ...currentState,
        ...{
          [key]: !isEditable[key],
        },
      };
    });

    if (isEditable[key] === true) {
      // save visitor center data
      if (
        visitorCenterData?.name !== updatedVisitorCenterData?.name ||
        visitorCenterData?.summary !== updatedVisitorCenterData?.summary
      ) {
        saveCenterData(
          updatedVisitorCenterData?.name,
          updatedVisitorCenterData?.summary
        );
      }

      // save dodo code
      if (
        updatedVisitorCenterData?.dodoCode?.length === 5 &&
        updatedVisitorCenterData?.dodoCode !== currentDodoCode &&
        updatedVisitorCenterData?.dodoCode !== "*****"
      ) {
        updateDodoCode(updatedVisitorCenterData?.dodoCode);
      } else {
        setVisitorCenterData((currentState) => {
          return { ...currentState, dodoCode: currentDodoCode || "*****" };
        });
      }
    }
  };

  const saveCenterData = (name, summary) => {
    if (name && summary && centerId) {
      const db = firebase.firestore();

      dispatch({ type: "UPDATE_VISITOR_CENTER_DATA" });

      db.collection("centers")
        .doc(centerId)
        .set(
          {
            name,
            summary,
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "UPDATE_VISITOR_CENTER_DATA_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "UPDATE_VISITOR_CENTER_DATA_FAIL", error });
        });
    } else {
      dispatch({
        type: "UPDATE_VISITOR_CENTER_DATA_FAIL",
        error: "Invalid visitor center data",
      });
    }
  };

  const updateDodoCode = (dodoCode) => {
    if (dodoCode) {
      const db = firebase.firestore();
      dispatch({ type: "UPDATE_DODO_CODE" });

      db.collection("users")
        .doc(uid)
        .set(
          {
            dodoCode,
          },
          { merge: true }
        )
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

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_VISITOR_CENTER" });
      dispatch({ type: "RESET_DODO_CODE" });
    };
  }, [dispatch]);

  const handleListenVisitorCenterData = useCallback(
    async (id) => {
      if (id && centerId) {
        const db = firebase.firestore();

        dispatch({ type: "FETCH_VISITOR_CENTER" });

        return db
          .collection("centers")
          .doc(centerId)
          .onSnapshot(
            (result) => {
              dispatch({
                type: "FETCH_VISITOR_CENTER_SUCCESS",
                visitorCenterData: result.data(),
              });
            },
            (error) => {
              dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
            }
          );
      }
    },
    [centerId, dispatch]
  );

  /**
   * Fetch center data when user authenticated.
   */
  useEffect(() => {
    let unsubscribe = null;
    async function fetchData() {
      unsubscribe = await handleListenVisitorCenterData(uid);
    }
    fetchData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, handleListenVisitorCenterData]);

  return {
    isOwner,
    handleFetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleEditSaveData,
    updatedVisitorCenterData,
    isUserFirstInQueue,
    isVisitorCenterOpen,
    waitingList,
    isLoading,
  };
};

export default useVisitorCenter;
