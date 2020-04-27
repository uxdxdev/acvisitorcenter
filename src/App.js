import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Root } from "./components/root";
import { StateProvider } from "./store";

const App = () => {
  const isDevEnv = process.env.NODE_ENV === "development";
  const [isVerified, setIsVerified] = useState(isDevEnv);

  // recaptcha onChange
  const onChange = (token) => {
    if (token) {
      setIsVerified(true);
    } else {
      // token expired
      setIsVerified(false);
    }
  };

  return (
    <div>
      {isVerified ? (
        <StateProvider>
          <Root />
        </StateProvider>
      ) : (
        <ReCAPTCHA
          sitekey={"6LdRQe4UAAAAACXdpngpIJRqwXsBweATo0zFa-WJ"}
          onChange={onChange}
          onExpired={onChange}
          onErrored={onChange}
        />
      )}
    </div>
  );
};

export default App;
