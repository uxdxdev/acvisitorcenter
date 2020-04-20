import React, { useState } from "react";
import "./App.css";
import ReCAPTCHA from "react-google-recaptcha";
import Routes from "./routes";

const App = () => {
  const isDevEnv = process.env.NODE_ENV === "development";
  const [isVerified, setIsVerified] = useState(isDevEnv);

  const onChange = (token) => {
    if (token) {
      setIsVerified(true);
    } else {
      // token expired
      setIsVerified(false);
    }
  };

  return (
    <div className="App">
      {isVerified ? (
        <Routes />
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
