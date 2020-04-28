import { useEffect, useContext, useState } from "react";
import { store } from "../../../store";
import { firebase } from "../../../utils/firebase";

const useRoot = () => {
  const context = useContext(store);
  const {
    dispatch,
    state: {
      auth: { uid },
    },
  } = context;

  // cookie consent
  let cookieConsent = localStorage.getItem("acvisitorcenter_cookie_consent");
  const [
    hasUserConsentedToUseCookies,
    setHasUserConsentedToUseCookies,
  ] = useState(cookieConsent);

  const updateCookieConsent = (value) => {
    localStorage.setItem("acvisitorcenter_cookie_consent", value);
    setHasUserConsentedToUseCookies(value);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user?.uid) {
        // user signed in
        dispatch({ type: "AUTH", uid: user.uid });
      } else {
        // only sign in if the user does not have an account id already.
        dispatch({ type: "UNAUTH" });

        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            // error signing in
          });
      }
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [dispatch]);

  return { hasUserConsentedToUseCookies, updateCookieConsent, uid };
};

export default useRoot;
