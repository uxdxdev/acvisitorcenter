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
import Analytics from "react-router-ga";
import { makeStyles } from "@material-ui/core/styles";
import { firebase } from "../utils/firebase";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
  },
}));

const Routes = () => {
  const isDevEnv = process.env.NODE_ENV === "development";
  const [isVerified, setIsVerified] = useState(isDevEnv);
  const classes = useStyles();

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
          <Typography variant="h2" component="h1" className={classes.title}>
            <Link
              component={RouterLink}
              to={`/`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              AC Visitor Center{" "}
              <span role="img" aria-label="island">
                🏝️
              </span>
            </Link>
          </Typography>
          <Typography>
            <Link
              component={RouterLink}
              to={`/`}
              onClick={() => {
                firebase.analytics().logEvent("create_visitor_center_link");
              }}
            >
              Home
            </Link>{" "}
            •{" "}
            <Link
              href="https://discord.gg/kwzezy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Link>
          </Typography>
        </Box>

        {isVerified ? (
          <Analytics id="UA-63312977-16">
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/center/:id">
                <VisitorCenter />
              </Route>
            </Switch>
          </Analytics>
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
