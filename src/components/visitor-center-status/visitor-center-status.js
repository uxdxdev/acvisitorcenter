import React from "react";
import { useVisitorCenterStatus } from "./hooks";
import { Box, Typography, Button } from "@material-ui/core";

const VisitorCenterStatus = () => {
  const {
    isVisitorCenterOpen,
    isOwner,
    gatesOpen,
    toggleGates,
  } = useVisitorCenterStatus();

  return (
    <>
      <Box
        bgcolor={isVisitorCenterOpen ? "success.main" : "secondary.main"}
        borderRadius={16}
        m={1}
      >
        <Typography align="center">
          {isVisitorCenterOpen
            ? "Visitor center is open"
            : "Visitor center is closed"}
        </Typography>
      </Box>
      {isOwner && (
        <>
          <Typography>Gates are {gatesOpen ? "open" : "closed"}</Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => toggleGates()}
          >
            {gatesOpen ? "Close gates" : "Open gates"}
          </Button>
        </>
      )}
    </>
  );
};

export default VisitorCenterStatus;
