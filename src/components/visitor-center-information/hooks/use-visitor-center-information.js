import { useContext, useEffect, useState } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      uid,
      centerData: currentCenterData,
      dodoCode: currentDodoCode,
      onlineStatus,
    },
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
      dispatch({ type: "UPDATE_DODO_CODE" });

      db.collection("users")
        .doc(id)
        .set(
          {
            dodoCode: updatedDodoCode,
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

  // listen for changes in online/offline status
  useEffect(() => {
    const visitorCenterOnlineStatusRef = firebase
      .database()
      .ref("users/" + centerId + "/state");
    visitorCenterOnlineStatusRef.on("value", (snapshot) => {
      dispatch({ type: "ONLINE_STATUS", onlineStatus: snapshot.val() });
    });
  }, [centerId, dispatch]);

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
    onlineStatus,
  };
};

export default useVisitorCenter;
