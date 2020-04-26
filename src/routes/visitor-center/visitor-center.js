import React, { useEffect, useContext } from "react";
import WaitiingList from "../../components/waiting-list/waiting-list";
import VisitorCenterInformation from "../../components/visitor-center-information/visitor-center-information";
import { useUser } from "../../hooks";
import { firebase } from "../../utils/firebase";
import { store } from "../../store";

const VisitorCenter = () => {
  const context = useContext(store);
  const { dispatch } = context;

  const { uid } = useUser();

  // update online status
  useEffect(() => {
    let userStatusDatabaseRef = null;
    const isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    if (uid) {
      const isOnlineForDatabase = {
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      userStatusDatabaseRef = firebase.database().ref("/users/" + uid);
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
          .then(() => userStatusDatabaseRef.set(isOfflineForDatabase));
    };
  }, [uid, dispatch]);

  return (
    <>
      <VisitorCenterInformation />
      <WaitiingList />
    </>
  );
};

export default VisitorCenter;
