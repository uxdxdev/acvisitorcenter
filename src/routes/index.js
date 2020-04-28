import React, { useState } from "react";
import { LandingPage } from "./landing-page";
import { VisitorCenter } from "./visitor-center";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import { Typography, Link, Container } from "@material-ui/core";

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
      <Container>
        <Link component={RouterLink} to={`/`}>
          <Typography variant="h1">AC Visitor Center</Typography>
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
      </Container>
    </Router>
  );
};

export default Routes;
