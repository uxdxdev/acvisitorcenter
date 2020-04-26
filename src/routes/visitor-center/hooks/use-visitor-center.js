import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      uid,
      isJoiningQueue,
      centerData,
      dodoCode,
      isFetchingDodoCode,
      isDeletingUser,
    },
  } = context;

  const ownerUid = centerData?.owner;
  const isOwner = ownerUid === uid;

  const setNextVisitor = useCallback(
    (nextVisitorUid) => {
      const db = firebase.firestore();

      uid &&
        db
          .collection("users")
          .doc(uid)
          .set(
            {
              next: nextVisitorUid,
            },
            { merge: true }
          )
          .then(() => {
            // success
            console.log("next visitor set");
          })
          .catch((error) => {
            console.log("updating next visitor failed", error);
          });
    },
    [uid]
  );

  const fetchCenterData = useCallback(() => {
    if (uid && centerId) {
      dispatch({ type: "LISTEN_CENTER_DATA" });
      const db = firebase.firestore();

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
              result.data()?.owner === uid &&
              result.data()?.waiting.length > 0
            ) {
              const nextVisitorUid = result.data()?.waiting[0]?.uid || "";
              setNextVisitor(nextVisitorUid);
            }
          },
          (error) => {
            console.log(error);
            dispatch({ type: "LISTEN_CENTER_DATA_FAIL", error });
          }
        );
    }
  }, [uid, centerId, dispatch, setNextVisitor]);

  /**
   * Fetch center data when user authenticated.
   */
  useEffect(() => {
    const unsubscribe = fetchCenterData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [fetchCenterData]);

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

    dispatch({ type: "JOIN_CENTER" });

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
        dispatch({ type: "JOIN_CENTER_SUCCESS" });
      })
      .catch((error) => {
        dispatch({ type: "JOIN_CENTER_FAIL", error });
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
  const fetchDodoCode = () => {
    const isFirstInQueue = centerData?.waiting[0]?.uid === uid;
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

  const saveCenterData = (centerId, centerData) => {
    const { name, summary } = centerData;
    if (
      name &&
      summary &&
      // data is not the same as before update
      (centerData?.name !== name || centerData?.summary !== summary)
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

  const updateDodoCode = (uid, updatedDodoCode) => {
    if (
      uid &&
      updatedDodoCode &&
      // data is not the same as before update
      updatedDodoCode !== dodoCode
    ) {
      const db = firebase.firestore();

      db.collection("users")
        .doc(uid)
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
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
    centerData,
    deleteUser,
    isDeletingUser,
    dodoCode,
    fetchDodoCode,
    isFetchingDodoCode,
    saveCenterData,
    updateDodoCode,
  };
};

export default useVisitorCenter;
