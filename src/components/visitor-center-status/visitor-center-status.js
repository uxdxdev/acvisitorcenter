import React from "react";
import { useVisitorCenterStatus } from "./hooks";
import { Box, Typography } from "@material-ui/core";

const VisitorCenterStatus = () => {
  const { isVisitorCenterOpen, isOwner } = useVisitorCenterStatus();

  return (
    <>
      <Box
        bgcolor={isVisitorCenterOpen ? "success.main" : "secondary.main"}
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
        <Box
          // bgcolor={isVisitorCenterOpen ? "success.main" : "secondary.main"}
          borderRadius={16}
          m={1}
        >
          <Typography align="center">
            Remember you must keep this page open in your browser so that your
            visitor center can operate correctly.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default VisitorCenterStatus;
