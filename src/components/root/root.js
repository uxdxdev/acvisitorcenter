import React, { useContext } from "react";
import Routes from "../../routes";
import { useRoot } from "./hooks";
import { store } from "../../store";
import { PageLoadingSpinner } from "../page-loading-spinner";

const AuthIsLoaded = ({ children }) => {
  const context = useContext(store);
  const {
    state: {
      auth: { uid },
    },
  } = context;

  if (!uid) return <PageLoadingSpinner />;
  return children;
};

const Root = () => {
  const { hasUserConsentedToUseCookies, updateCookieConsent } = useRoot();

  return (
    <AuthIsLoaded>
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
    </AuthIsLoaded>
  );
};

export default Root;
