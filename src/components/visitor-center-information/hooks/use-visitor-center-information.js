import { useContext, useEffect, useState, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
      visitorCenter: { visitorCenterData, onlineStatus },
      dodoCode: { code: currentDodoCode },
    },
  } = context;

  const waitingList = visitorCenterData?.waiting;
  const ownerUid = visitorCenterData?.owner;

  const isOwner = uid === centerId;
  const isUserFirstInQueue = waitingList && waitingList[0]?.uid === uid;
  const isVisitorCenterOpen = onlineStatus === "online";
  const isLoading = visitorCenterData === undefined;

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

  const [centerInformation, setCenterInformation] = useState({
    name: "Loading...",
    summary: "Loading...",
  });

  useEffect(() => {
    visitorCenterData && setCenterInformation(visitorCenterData);
  }, [visitorCenterData]);

  const handleCenterInformationChange = ({ id, value }) => {
    setCenterInformation((currentState) => {
      return { ...currentState, ...{ [id]: value } };
    });
  };

  const [latestDodoCode, setDodoCode] = useState({ dodoCode: "*****" });

  useEffect(() => {
    currentDodoCode && setDodoCode({ dodoCode: currentDodoCode });
  }, [currentDodoCode]);

  const handleDodoCodeChange = ({ id, value }) => {
    setDodoCode({ [id]: value });
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleUpdateCenterInformation = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      if (
        visitorCenterData?.name !== centerInformation?.name ||
        visitorCenterData?.summary !== centerInformation?.summary
      ) {
        saveCenterData(centerId, centerInformation);
      } else {
        setCenterInformation(visitorCenterData);
      }

      // validate dodo code
      if (
        latestDodoCode?.dodoCode?.length === 5 &&
        latestDodoCode?.dodoCode !== currentDodoCode &&
        latestDodoCode?.dodoCode !== "*****"
      ) {
        updateDodoCode(latestDodoCode?.dodoCode);
      } else {
        setDodoCode({ dodoCode: currentDodoCode || "*****" });
      }
    }
  };

  const saveCenterData = (centerId, data) => {
    const { name, summary } = data;
    if (name && summary) {
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
    if (uid && dodoCode) {
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
    handleDodoCodeChange,
    handleUpdateCenterInformation,
    centerInformation,
    latestDodoCode,
    isUserFirstInQueue,
    isVisitorCenterOpen,
    waitingList,
    isLoading,
  };
};

export default useVisitorCenter;
