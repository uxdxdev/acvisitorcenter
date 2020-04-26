import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, centerData: currentCenterData, isJoiningQueue },
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

  const handleListenVisitorCenterDataAndUpdateWaitingList = useCallback(
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
            // fails to listen
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
      unsubscribe = await handleListenVisitorCenterDataAndUpdateWaitingList(
        uid
      );
    }
    fetchData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, handleListenVisitorCenterDataAndUpdateWaitingList]);

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

  return {
    waitingList,
    deleteUser,
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
  };
};

export default useVisitorCenter;
