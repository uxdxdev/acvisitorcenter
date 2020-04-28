import React from "react";
import { useVisitorCenterStatus } from "./hooks";
import { Box, Typography } from "@material-ui/core";

const VisitorCenterStatus = () => {
  const { isVisitorCenterOpen } = useVisitorCenterStatus();
  return (
    <Box
      bgcolor={isVisitorCenterOpen ? "success.main" : "secondary.main"}
      borderRadius={16}
      p={1}
      m={1}
    >
      <Typography align="center">
        {isVisitorCenterOpen ? "Open" : "Closed"}
      </Typography>
    </Box>
  );
};

export default VisitorCenterStatus;
