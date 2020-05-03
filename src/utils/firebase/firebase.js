import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";

// eslint-disable-next-line no-restricted-globals
const isDevEnv = location.hostname === "localhost";
const firebaseConfig = {
  apiKey: "AIzaSyDO7BqcLUNL0RCvhlNdO3YGiekQXE9-S-w",
  authDomain: "acvisitorcenter.firebaseapp.com",
  databaseURL: isDevEnv
    ? "http://localhost:9000?ns=acvisitorcenter"
    : "https://acvisitorcenter.firebaseio.com",
  projectId: "acvisitorcenter",
  storageBucket: "acvisitorcenter.appspot.com",
  messagingSenderId: "783477777649",
  appId: "1:783477777649:web:12de6a85b3c7608f8a7550",
  measurementId: "G-KW9G89BTCG",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();
const firestoreDb = firebaseApp.firestore();

// this will connect the browser to the local emulator for firestore, avoiding using the quota during development.
// IMPORTANT: when viewing the dev version of the app from a remote device using this dev machines IP, the app will
// connect to the live database.
if (isDevEnv) {
  // Note that the Firebase Web SDK must connect to the WebChannel port
  firestoreDb.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export default firebase;
