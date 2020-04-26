import { useContext, useEffect, useState, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, centerData: currentCenterData, dodoCode: currentDodoCode },
  } = context;

  const waitingList = currentCenterData?.waiting;
  const ownerUid = currentCenterData?.owner;
  const isOwner = ownerUid && uid && ownerUid === uid;

  /**
   * Fetch center data from firestore.
   */
  const fetchDodoCode = (id) => {
    const isFirstInQueue = currentCenterData?.waiting[0]?.uid === id;
    if ((isOwner || isFirstInQueue) && ownerUid) {
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

  const [isEditable, setIsEditable] = useState(false);

  const [centerInformation, setCenterInformation] = useState({
    name: "",
    summary: "",
  });

  useEffect(() => {
    currentCenterData && setCenterInformation(currentCenterData);
  }, [currentCenterData]);

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

  const updateCenterInformation = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      if (
        currentCenterData?.name !== centerInformation?.name ||
        currentCenterData?.summary !== centerInformation?.summary
      ) {
        saveCenterData(centerId, centerInformation);
      } else {
        setCenterInformation(currentCenterData);
      }

      // validate dodo code
      if (
        latestDodoCode?.dodoCode?.length === 5 &&
        latestDodoCode?.dodoCode !== currentDodoCode &&
        latestDodoCode?.dodoCode !== "*****"
      ) {
        updateDodoCode(uid, latestDodoCode?.dodoCode);
      } else {
        setDodoCode({ dodoCode: currentDodoCode || "*****" });
      }
    }
  };

  const saveCenterData = (centerId, centerData) => {
    const { name, summary } = centerData;
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

  const updateDodoCode = (id, updatedDodoCode) => {
    if (id && updatedDodoCode) {
      const db = firebase.firestore();

      db.collection("users")
        .doc(id)
        .set(
          {
            dodoCode: updatedDodoCode,
          },
          { merge: true }
        )
        .then(() => {
          // success
          console.log("dodo code updated");
        })
        .catch((error) => {
          console.log("updating dodo code failed", error);
        });
    } else {
      console.log("invalid dodo code");
    }
  };

  const setVisitorCenterOpenStatus = useCallback(
    (id, status) => {
      const db = firebase.firestore();

      dispatch({ type: "UPDATE_VISITOR_CENTER_OPEN_STATUS" });

      uid &&
        db
          .collection("users")
          .doc(id)
          .set(
            {
              open: status,
            },
            { merge: true }
          )
          .then(() => {
            dispatch({ type: "UPDATE_VISITOR_CENTER_OPEN_STATUS_SUCCESS" });
          })
          .catch((error) => {
            dispatch({ type: "UPDATE_VISITOR_CENTER_OPEN_STATUS_FAIL", error });
          });
    },
    [uid, dispatch]
  );

  // useEffect(() => {
  //   uid && setVisitorCenterOpenStatus(centerId, true);
  //   return () => {
  //     setVisitorCenterOpenStatus(centerId, false);
  //   };
  // }, [setVisitorCenterOpenStatus, centerId]);

  return {
    waitingList,
    isOwner,
    fetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleDodoCodeChange,
    updateCenterInformation,
    centerInformation,
    latestDodoCode,
  };
};

export default useVisitorCenter;
