import React from "react";
import Routes from "../../routes";
import { useAuth } from "./hooks";

const Auth = () => {
  const { hasUserConsentedToUseCookies, updateCookieConsent } = useAuth();

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
