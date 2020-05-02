import React, { useRef } from "react";
import { Typography, Paper, TextField, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useJoinQueue from "./hooks/use-join-queue";
import { useParams } from "react-router-dom";
import { firebase } from "../../utils/firebase";

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
    isVisitorCenterOpen,
    userAlreadyInQueue,
    waitingList,
    isJoiningQueue,
    isDeletingUser,
  } = useJoinQueue(centerId);

  const classes = useStyles();
  const nameInputRef = useRef();

  const isQueueFull = waitingList?.length >= 20;

  const positionInQueue =
    waitingList && waitingList.findIndex((user) => user?.uid === uid) + 1;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && centerId && !userAlreadyInQueue) {
      !isQueueFull && joinVisitorQueue(centerId, name);
    }
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Typography variant="h2">Join visitor queue</Typography>

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
          disabled={
            userAlreadyInQueue ||
            !isVisitorCenterOpen ||
            isQueueFull ||
            isJoiningQueue
          }
        />
        <br />
        <Box mt={1} mb={1}>
          <Button
            className={classes.buttonMarginRight}
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            disabled={
              userAlreadyInQueue ||
              !isVisitorCenterOpen ||
              isQueueFull ||
              isJoiningQueue
            }
          >
            Join queue
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              firebase.analytics().logEvent("button_click_join_queue");
              handleDeleteUser(uid);
            }}
            disabled={!userAlreadyInQueue || isDeletingUser}
          >
            Leave
          </Button>
        </Box>
        {userAlreadyInQueue && (
          <Typography>Position #{positionInQueue}</Typography>
        )}
      </form>
    </Paper>
  );
};

export default JoinQueue;
