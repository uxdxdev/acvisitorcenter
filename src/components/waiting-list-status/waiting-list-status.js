import React from "react";
import { useWaitingListStatus } from "./hooks";
import { Box, Typography } from "@material-ui/core";

const WaitingListStatus = () => {
  const { isQueueUnlocked } = useWaitingListStatus();
  return (
    <Box
      bgcolor={isQueueUnlocked ? "success.main" : "error.main"}
      borderRadius={16}
      m={1}
    >
      <Typography align="center">
        {isQueueUnlocked ? "Queue unlocked" : "Queue locked"}
      </Typography>
    </Box>
  );
};

export default WaitingListStatus;
