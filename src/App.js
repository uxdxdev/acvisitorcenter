import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import ReCAPTCHA from "react-google-recaptcha";
import Routes from "./routes";
import { firebase } from "./utils/firebase";
import { store } from "./store";

const App = () => {
  const isDevEnv = process.env.NODE_ENV === "development";
  const [isVerified, setIsVerified] = useState(isDevEnv);
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

  // recaptcha onChange
  const onChange = (token) => {
    if (token) {
      setIsVerified(true);
    } else {
      // token expired
      setIsVerified(false);
    }
  };

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
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // console.log(errorCode, errorMessage);
      });
  }, []);

  return (
    <div className="App">
      <h1>Animal Crossing Visitor Queue</h1>
      {isVerified ? (
        <>
          {!hasUserConsentedToUseCookies && (
            <div id="cookieConsent">
              We use cookies to give you the best experience on our website. If
              you continue to use this site we will assume that you are happy
              with it.
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
      ) : (
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={onChange}
          onExpired={onChange}
          onErrored={onChange}
        />
      )}
    </div>
  );
};

export default App;
