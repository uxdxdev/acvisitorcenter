import { useContext, useEffect, useState, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";
import { fetchDodoCode } from "../../../actions/dodo-code-actions";

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
      dodoCode: { code, isFetchingDodoCode },
    },
  } = context;

  const waitingList = visitorCenterData?.waiting;
  const ownerUid = visitorCenterData?.owner;
  const gatesOpen = visitorCenterData?.gatesOpen;

  const isOwner = uid === centerId;
  const isUserFirstInQueue = waitingList && waitingList[0]?.uid === uid;
  const isOwnerOnline = onlineStatus === "online";
  const isVisitorCenterOpen = isOwnerOnline && gatesOpen;
  const isUserInQueue =
    waitingList && waitingList.filter((user) => user.uid === uid)?.length > 0;
  const isLoading = isFetchingVisitorCenterData || !visitorCenterData;

  const handleFetchDodoCode = () => {
    if (
      ownerUid &&
      (isOwner ||
        (isUserFirstInQueue && (!code || code === "*****") && ownerUid))
    ) {
      fetchDodoCode(dispatch, ownerUid);
    } else {
      dispatch({
        type: "FETCH_DODO_CODE_FAIL",
        error: "Error fetching dodo code",
      });
    }
  };

  const [updatedVisitorCenterData, setVisitorCenterData] = useState({
    name: "Loading...",
    summary: "Loading...",
    dodoCode: "*****",
  });

  const [isEditable, setIsEditable] = useState({});

  useEffect(() => {
    if (visitorCenterData) {
      const updatedData = Object.assign(
        {},
        {
          name:
            // don't update the name or summary if the owner is editing it
            isOwner && isEditable.name
              ? updatedVisitorCenterData.name
              : visitorCenterData.name,
          summary:
            isOwner && isEditable.summary
              ? updatedVisitorCenterData.summary
              : visitorCenterData.summary,
          owner: visitorCenterData.owner,
          waiting: visitorCenterData.waiting,
          participants: visitorCenterData.participants,
          gatesOpen: visitorCenterData.gatesOpen,
          createdAt: visitorCenterData.createdAt,
        }
      );
      visitorCenterData &&
        setVisitorCenterData({
          ...updatedData,
          dodoCode:
            isOwner && isEditable.dodoCode
              ? updatedVisitorCenterData.dodoCode
              : code || "*****",
        });
    }
  }, [
    isEditable.name,
    isEditable.summary,
    isEditable.dodoCode,
    updatedVisitorCenterData.name,
    updatedVisitorCenterData.summary,
    updatedVisitorCenterData.dodoCode,
    isOwner,
    visitorCenterData,
    code,
  ]);

  const handleCenterInformationChange = (id, value) => {
    setVisitorCenterData((currentState) => {
      return { ...currentState, ...{ [id]: value } };
    });
  };

  const handleEditSaveData = (key) => {
    setIsEditable({
      [key]: !isEditable[key],
    });

    if (isEditable.name === true && updatedVisitorCenterData?.name) {
      // save visitor center data
      if (visitorCenterData?.name !== updatedVisitorCenterData?.name) {
        saveCenterData({ name: updatedVisitorCenterData?.name });
      }
    }
    if (isEditable.summary === true && updatedVisitorCenterData?.summary) {
      // save visitor center data
      if (visitorCenterData?.summary !== updatedVisitorCenterData?.summary) {
        saveCenterData({ summary: updatedVisitorCenterData?.summary });
      }
    }

    if (isEditable.dodoCode === true && updatedVisitorCenterData?.dodoCode) {
      // save dodo code
      if (
        updatedVisitorCenterData?.dodoCode?.length === 5 &&
        updatedVisitorCenterData?.dodoCode !== code &&
        updatedVisitorCenterData?.dodoCode !== "*****"
      ) {
        updateDodoCode(updatedVisitorCenterData?.dodoCode);
      }
    }
  };

  const saveCenterData = ({ name, summary }) => {
    const db = firebase.firestore();

    dispatch({ type: "UPDATE_VISITOR_CENTER_DATA" });

    db.collection("centers")
      .doc(centerId)
      .set(
        {
          // optionally add key to object
          ...(name && { name }),
          ...(summary && { summary }),
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "UPDATE_VISITOR_CENTER_DATA_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "UPDATE_VISITOR_CENTER_DATA_FAIL", error });
      });
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
          dispatch({ type: "UPDATE_DODO_CODE_SUCCESS", dodoCode });
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

        dispatch({ type: "LISTEN_VISITOR_CENTER_DATA" });

        return db
          .collection("centers")
          .doc(centerId)
          .onSnapshot(
            (result) => {
              dispatch({
                type: "LISTEN_VISITOR_CENTER_DATA_SUCCESS",
                visitorCenterData: result.data(),
              });
            },
            (error) => {
              dispatch({ type: "LISTEN_VISITOR_CENTER_DATA_FAIL", error });
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
    code,
    isUserFirstInQueue,
    isVisitorCenterOpen,
    isLoading,
    isFetchingDodoCode,
    isOwnerOnline,
    isUserInQueue,
  };
};

export default useVisitorCenter;
