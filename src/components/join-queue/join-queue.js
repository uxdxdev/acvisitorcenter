import React, { useRef } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useJoinQueue from "./hooks/use-join-queue";
import { useParams } from "react-router-dom";
import { firebase } from "../../utils/firebase";
import { QUEUE_LIMIT } from "../../constants";
const useStyles = makeStyles((theme) => ({
  buttonMarginRight: {
    marginRight: theme.spacing(1),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const JoinQueue = () => {
  const { id: centerId } = useParams();
  const {
    uid,
    handleDeleteUser,
    joinVisitorQueue,
    isUserInQueue,
    waitingList,
    isDeletingUser,
    isJoinQueueEnabled,
    isJoiningQueue,
  } = useJoinQueue(centerId);

  const classes = useStyles();
  const nameInputRef = useRef();

  const isQueueFull = waitingList?.length >= QUEUE_LIMIT;

  const positionInQueue =
    waitingList && waitingList.findIndex((user) => user?.uid === uid) + 1;

  const handleSubmit = (event) => {
    event.preventDefault();

    let name = event.target.name.value;

    if (name && centerId && !isUserInQueue) {
      !isQueueFull &&
        joinVisitorQueue(centerId, name).then(() => {
          nameInputRef.current.value = "";
        });
    }
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Typography variant="subtitle2">
        {isQueueFull
          ? "Queue is full"
          : `${waitingList?.length} in queue (Max ${QUEUE_LIMIT})`}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          label="Name"
          inputRef={nameInputRef}
          id="name"
          required
          maxLength="30"
          inputProps={{ maxLength: "30" }}
          variant="outlined"
          margin="dense"
          disabled={!isJoinQueueEnabled}
        />
        <br />
        <Box mt={1} mb={1}>
          <Button
            className={classes.buttonMarginRight}
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            disabled={!isJoinQueueEnabled}
            endIcon={isJoiningQueue && <CircularProgress size={12} />}
          >
            Join queue
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              firebase.analytics().logEvent("join_queue");
              handleDeleteUser(uid);
            }}
            disabled={!isUserInQueue || isDeletingUser}
            endIcon={isDeletingUser && <CircularProgress size={12} />}
          >
            Leave
          </Button>
        </Box>
        {isUserInQueue && (
          <Typography>
            You are in position #{positionInQueue} of #{waitingList?.length}
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default JoinQueue;
