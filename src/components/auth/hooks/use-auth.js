import { useEffect, useContext, useState } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useLatestQueues = () => {
  const context = useContext(store);
  const { dispatch } = context;

  // cookie consent
  let cookieConsent = localStorage.getItem("acvisitorqueue_cookie_consent");
  const [
    hasUserConsentedToUseCookies,
    setHasUserConsentedToUseCookies,
  ] = useState(cookieConsent);

  const updateCookieConsent = (value) => {
    localStorage.setItem("acvisitorqueue_cookie_consent", value);
    setHasUserConsentedToUseCookies(value);
  };

  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // error signing in
      });
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user?.uid) {
        // user signed in
        dispatch({ type: "AUTH", uid: user.uid });
      } else {
        // user signed out
        dispatch({ type: "UNAUTH" });
      }
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [dispatch]);

  return { hasUserConsentedToUseCookies, updateCookieConsent };
};

export default useLatestQueues;
