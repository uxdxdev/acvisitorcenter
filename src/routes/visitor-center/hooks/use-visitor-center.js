import { useContext, useEffect, useCallback } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useVisitorCenter = (centerId) => {
  const context = useContext(store);
  const {
    dispatch,
    state: { uid, isJoiningCenter, centerData, dodoCode },
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
          })
          .catch((error) => {
            console.log("updating next visitor failed", error);
          });
    },
    [uid]
  );

  const fetchCenterData = useCallback(() => {
    if (uid && centerId) {
      dispatch({ type: "FETCH_QUEUE_DATA" });
      const db = firebase.firestore();

      return db
        .collection("centers")
        .doc(centerId)
        .onSnapshot(
          (result) => {
            dispatch({
              type: "FETCH_QUEUE_DATA_SUCCESS",
              centerData: result.data(),
            });

            // update the next visitor uid
            if (result.data()?.owner === uid) {
              const nextVisitorUid = result.data()?.waiting[0]?.uid || "";
              setNextVisitor(nextVisitorUid);
            }
          },
          (error) => {
            dispatch({ type: "FETCH_QUEUE_DATA_FAIL", error });
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
  const joinCenter = (id, { name, uid }) => {
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
  const fetchDodoCode = () => {
    const isFirstInCenter = centerData?.waiting[0]?.uid === uid;
    if ((isOwner || isFirstInCenter) && ownerUid) {
      dispatch({ type: "FETCH_ISLAND_CODE" });

      return firebase
        .firestore()
        .collection("users")
        .doc(ownerUid)
        .get()
        .then((result) => {
          const { dodoCode } = result.data();
          dispatch({ type: "FETCH_ISLAND_CODE_SUCCESS", dodoCode });
        })
        .catch((error) => {
          dispatch({ type: "FETCH_ISLAND_CODE_FAIL", error });
        });
    } else {
      dispatch({ type: "FETCH_ISLAND_CODE_FAIL" });
    }
  };

  return {
    isOwner,
    isJoiningCenter,
    centerData,
    joinCenter,
    deleteUser,
    dodoCode,
    fetchDodoCode,
  };
};

export default useVisitorCenter;
