import React, { useState } from "react";
import { LandingPage } from "./landing-page";
import { VisitorCenter } from "./visitor-center";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
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
        <Box align="center" mt={4} mb={2}>
          <Link
            component={RouterLink}
            to={`/`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={logo} alt="crossed arrows" width="100" />
          </Link>
          <Typography variant="h1">AC Visitor Center</Typography>

          <Link
            href="https://discord.gg/kwzezy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography>Join the Discord server</Typography>
          </Link>
        </Box>

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
          <Box align="center">
            <ReCAPTCHA
              sitekey={"6LdRQe4UAAAAACXdpngpIJRqwXsBweATo0zFa-WJ"}
              onChange={onChange}
              onExpired={onChange}
              onErrored={onChange}
            />
          </Box>
        )}
      </Container>
    </Router>
  );
};

export default Routes;
