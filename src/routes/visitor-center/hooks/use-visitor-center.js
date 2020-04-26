import { useContext, useEffect, useCallback, useState } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      uid,
      isJoiningQueue,
      centerData: currentCenterData,
      dodoCode: currentDodoCode,
      isFetchingCenterDataError,
    },
  } = context;

  const waitingList = currentCenterData?.waiting;
  const ownerUid = currentCenterData?.owner;
  const isOwner = ownerUid === uid;

  const setNextVisitor = useCallback(
    (nextVisitorUid) => {
      const db = firebase.firestore();

      dispatch({ type: "SET_NEXT_VISITOR" });

      centerId &&
        db
          .collection("users")
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
    },
    [dispatch, centerId]
  );

  const fetchCenterData = useCallback(
    async (id) => {
      if (id && centerId) {
        const db = firebase.firestore();

        // check if the visitor center exists before making any further requests
        const visitorCenterExists = await firebase
          .firestore()
          .collection("centers")
          .doc(centerId)
          .get()
          .then((result) => {
            if (result.exists) {
              return result.exists;
            } else {
              throw new Error("visitor center does not exist");
            }
          })
          .catch((error) => {
            dispatch({ type: "LISTEN_CENTER_DATA_FAIL", error });
          });

        if (!visitorCenterExists) return null;

        dispatch({ type: "LISTEN_CENTER_DATA" });

        return db
          .collection("centers")
          .doc(centerId)
          .onSnapshot(
            (result) => {
              dispatch({
                type: "LISTEN_CENTER_DATA_SUCCESS",
                centerData: result.data(),
              });

              // update the next visitor uid
              if (
                result.data()?.owner === id &&
                result.data()?.waiting.length > 0
              ) {
                const nextVisitorUid = result.data()?.waiting[0]?.uid || "";
                setNextVisitor(nextVisitorUid);
              }
            },
            (error) => {
              dispatch({ type: "LISTEN_CENTER_DATA_FAIL", error });
            }
          );
      }
    },
    [centerId, dispatch, setNextVisitor]
  );

  /**
   * Fetch center data when user authenticated.
   */
  useEffect(() => {
    let unsubscribe = null;
    async function fetchData() {
      unsubscribe = await fetchCenterData(uid);
    }
    fetchData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, fetchCenterData]);

  /**
   * Join visitor center.
   *
   * @param {*} id center id
   * @param {*} data.name visitor center name
   * @param {*} data.uid user id
   */
  const joinVisitorQueue = (id, { name, uid }) => {
    const db = firebase.firestore();
    const centersRef = db.collection("centers").doc(id);

    dispatch({ type: "JOIN_QUEUE" });

    // run transaction to join center
    db.runTransaction((transaction) => {
      return transaction.get(centersRef).then((snapshot) => {
        const waitingArray = snapshot.get("waiting");
        const joinedAt = firebase.firestore.Timestamp.fromDate(new Date());
        waitingArray.push({ name, uid, joinedAt });
        transaction.update(centersRef, "waiting", waitingArray);
      });
    })
      .then(() => {
        dispatch({ type: "JOIN_QUEUE_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "JOIN_QUEUE_FAIL", error });
      });
  };

  /**
   * Join visitor center.
   *
   * @param {*} id center id
   * @param {*} data.name visitor center name
   * @param {*} data.uid user id
   */
  const deleteUser = (id, deleteUid) => {
    const db = firebase.firestore();
    const centersRef = db.collection("centers").doc(id);

    dispatch({ type: "DELETE_USER" });

    // run transaction to join center
    return db
      .runTransaction((transaction) => {
        return transaction.get(centersRef).then((snapshot) => {
          let waitingArray = snapshot.get("waiting");
          waitingArray = waitingArray.filter((user) => user.uid !== deleteUid);
          transaction.update(centersRef, "waiting", waitingArray);
        });
      })
      .then(() => {
        dispatch({ type: "DELETE_USER_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "DELETE_USER_FAIL", error });
      });
  };

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
          dispatch({ type: "FETCH_DODO_CODE_FAIL", error });
        });
    } else {
      dispatch({
        type: "FETCH_DODO_CODE_FAIL",
        error: "User is not owner or first in the queue",
      });
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const [centerInformation, setCenterInformation] = useState({
    name: "Loading...",
    summary: "Loading...",
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
      saveCenterData(centerId, centerInformation);
      updateDodoCode(uid, latestDodoCode?.dodoCode);
    }
  };

  const saveCenterData = (centerId, centerData) => {
    const { name, summary } = centerData;
    if (
      name &&
      summary &&
      // data is not the same as before update
      (currentCenterData?.name !== name ||
        currentCenterData?.summary !== summary)
    ) {
      const db = firebase.firestore();

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
          // success
          console.log("center data updated");
        })
        .catch((error) => {
          console.log("updating center data failed", error);
        });
    } else {
      console.log("center data is the same");
    }
  };

  const updateDodoCode = (id, updatedDodoCode) => {
    if (id && updatedDodoCode && updatedDodoCode !== currentDodoCode) {
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
      console.log("center data is the same");
    }
  };

  return {
    waitingList,
    isJoiningQueue,
    joinVisitorQueue,
    deleteUser,
    isOwner,
    fetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleDodoCodeChange,
    updateCenterInformation,
    centerInformation,
    latestDodoCode,
    isFetchingCenterDataError,
  };
};

export default useVisitorCenter;
