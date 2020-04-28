import { useContext, useEffect } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";
import { useParams } from "react-router-dom";

const useVisitorCenterStatus = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
      visitorCenter: { onlineStatus },
    },
  } = context;
  const { id: centerId } = useParams();

  const isVisitorCenterOpen = onlineStatus === "online";
  const isOwner = uid === centerId;

  // init listeners for online status
  useEffect(() => {
    let userStatusDatabaseRef = null;
    const isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    if (centerId && isOwner) {
      const isOnlineForDatabase = {
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      userStatusDatabaseRef = firebase.database().ref("/users/" + centerId);
      // We'll create two constants which we will write to
      // // the Realtime database when this device is offline
      // // or online.

      firebase
        .database()
        .ref(".info/connected")
        .on("value", (snapshot) => {
          if (snapshot.val() === false) {
            return;
          }

          userStatusDatabaseRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusDatabaseRef.set(isOnlineForDatabase);
            })
            .catch((error) => {
              console.log("this is not your center!!");
            });
        });
    }

    // disconnect the user when they navigate
    // away from the visitor center
    return () => {
      userStatusDatabaseRef &&
        userStatusDatabaseRef
          .onDisconnect()
          // this can be set to any value
          // it tells firebase to disconnect manually
          .set("going offline")
          // set the offline status in db
          .then(() => {
            userStatusDatabaseRef.set(isOfflineForDatabase);
          })
          .catch((error) => {
            console.log("this is not your center!!");
          });
    };
  }, [uid, centerId, dispatch]);

  // listen for changes in online/offline status
  // of visitor center
  useEffect(() => {
    let visitorCenterOnlineStatusRef;
    if (centerId) {
      visitorCenterOnlineStatusRef = firebase
        .database()
        .ref("users/" + centerId + "/state");
      visitorCenterOnlineStatusRef.on("value", (snapshot) => {
        dispatch({
          type: "VISITOR_CENTER_STATUS",
          onlineStatus: snapshot.val(),
        });
      });
    }
    return () => {
      visitorCenterOnlineStatusRef && visitorCenterOnlineStatusRef.off();
    };
  }, [centerId, dispatch]);

  return {
    isVisitorCenterOpen,
  };
};

export default useVisitorCenterStatus;
