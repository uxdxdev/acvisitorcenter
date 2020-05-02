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
  const { isOwnerOnline } = useVisitorCenterStatus();
  const classes = useStyles();
  return (
    <>
      <Box
        bgcolor={isOwnerOnline ? "success.main" : "error.main"}
        borderRadius={16}
        m={1}
      >
        <Typography align="center" component="p" variant="h3">
          {isOwnerOnline ? "Visitor center open" : "Visitor center closed"}
        </Typography>
      </Box>
      <Box borderRadius={16} m={1}>
        <Typography align="center" className={classes.subtitle}>
          Keep this page open in your browser so the visitor center can operate
          correctly.
        </Typography>
      </Box>
    </>
  );
};

export default VisitorCenterStatus;
