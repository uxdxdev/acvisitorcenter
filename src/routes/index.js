import React, { useState } from "react";
import { LandingPage } from "./landing-page";
import { VisitorCenter } from "./visitor-center";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Routes = () => {
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
    <Router>
      <Link to={`/`}>
        <h1>AC Visitor Center</h1>
      </Link>
      {isVerified ? (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/center/:id">
            <VisitorCenter />
          </Route>
        </Switch>
      ) : (
        <ReCAPTCHA
          sitekey={"6LdRQe4UAAAAACXdpngpIJRqwXsBweATo0zFa-WJ"}
          onChange={onChange}
          onExpired={onChange}
          onErrored={onChange}
        />
      )}
    </Router>
  );
};

export default Routes;
