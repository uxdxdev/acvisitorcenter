import React, { useContext } from "react";
import Routes from "../../routes";
import { useRoot } from "./hooks";
import { store } from "../../store";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { Paper, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const Root = () => {
  const { hasUserConsentedToUseCookies, updateCookieConsent } = useRoot();
  const classes = useStyles();

  return (
    <AuthIsLoaded>
      {!hasUserConsentedToUseCookies && (
        <Paper elevation={0} variant="outlined" className={classes.paper}>
          <Typography id="cookieConsent" align="center">
            We use cookies to give you the best experience on our website. If
            you continue to use this site we will assume that you are happy with
            it.{" "}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                updateCookieConsent(true);
              }}
            >
              Hide
            </Button>
          </Typography>
        </Paper>
      )}
      <Routes />
    </AuthIsLoaded>
  );
};

export default Root;
