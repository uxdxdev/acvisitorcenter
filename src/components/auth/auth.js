import React, { useState, useEffect, useContext } from "react";
import Routes from "../../routes";
import { firebase } from "../../utils/firebase";
import { store } from "../../store";

const Auth = () => {
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

  // sign in
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // user signed in
        dispatch({ type: "AUTH", uid: user.uid });
      } else {
        // user signed out
        dispatch({ type: "UNAUTH" });
      }
    });
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // error signing in
      });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      {!hasUserConsentedToUseCookies && (
        <div id="cookieConsent">
          We use cookies to give you the best experience on our website. If you
          continue to use this site we will assume that you are happy with it.
          <button
            onClick={() => {
              updateCookieConsent(true);
            }}
          >
            Hide
          </button>
        </div>
      )}
      <Routes />
    </>
  );
};

export default Auth;
