import React from "react";
import { useVisitorCenterStatus } from "./hooks";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  subtitle: {
    color: theme.palette.common.black,
  },
}));

const VisitorCenterStatus = () => {
  const { isVisitorCenterOpen, isOwner } = useVisitorCenterStatus();
  const classes = useStyles();
  return (
    <>
      <Box
        bgcolor={isVisitorCenterOpen ? "success.main" : "error.main"}
        borderRadius={16}
        m={1}
      >
        <Typography align="center">
          {isVisitorCenterOpen
            ? "Visitor center gates are open"
            : "Visitor center gates closed"}
        </Typography>
      </Box>
      {isOwner && (
        <Box borderRadius={16} m={1}>
          <Typography align="center" className={classes.subtitle}>
            Keep this page open in your browser so that your visitor center can
            operate correctly.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default VisitorCenterStatus;
