import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQKZu7jqErlRnTZceBf3dXw2xUsxqiE5g",
  authDomain: "acvisitorqueue.firebaseapp.com",
  databaseURL: "https://acvisitorqueue.firebaseio.com",
  projectId: "acvisitorqueue",
  storageBucket: "acvisitorqueue.appspot.com",
  messagingSenderId: "492470119581",
  appId: "1:492470119581:web:e4fa1917b6f8d56ed6f874",
  measurementId: "G-FSYMSFMT0C",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

// this will connect the browser to the local emulator for firestore, avoiding using the quota during development.
// IMPORTANT: when viewing the dev version of the app from a remote device using this dev machines IP, the app will
// connect to the live database.
if (
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost" &&
  !process.env.REACT_APP_CONNECT_TO_PROD_FIREBASE
) {
  // Note that the Firebase Web SDK must connect to the WebChannel port
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export default firebase;
