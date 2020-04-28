import React, { useState } from "react";
import { LandingPage } from "./landing-page";
import { VisitorCenter } from "./visitor-center";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../logo.png";

import { Box, Link, Container, Typography } from "@material-ui/core";

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
        <Link
          component={RouterLink}
          to={`/`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Box align="center" mt={4} mb={2}>
            <img src={logo} alt="crossed arrows" width="100" />
            <Typography variant="h1">AC Visitor Center</Typography>
          </Box>
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
