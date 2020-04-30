import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWaitingList } from "./hooks";
import moment from "moment";
import {
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Chip,
} from "@material-ui/core";
import { Person as PersonIcon, FlightTakeoff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonMarginRight: {
    marginRight: theme.spacing(1),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const WaitingList = () => {
  const { id: centerId } = useParams();
  const {
    uid,
    handleDeleteUser,
    handleClearWaitingList,
    isOwner,
    joinVisitorQueue,
    isVisitorCenterOpen,
    userAlreadyInQueue,
    waitingList,
    toggleGates,
    gatesOpen,
  } = useWaitingList(centerId);
  const classes = useStyles();

  const [prevVisitor, setPrevVisitor] = useState(null);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (waitingList) {
      setPrevVisitor(String(currentVisitor));
      setCurrentVisitor(String(waitingList[0]?.uid));

      if (prevVisitor !== currentVisitor) {
        setSeconds(0);
      }
    }
  }, [waitingList, prevVisitor, currentVisitor]);

  const NextVisitorTimer = () => {
    const tick = () => {
      setSeconds((current) => current + 1);
    };

    useEffect(() => {
      let interval = null;
      if (waitingList?.length > 0) {
        interval = setInterval(tick, 1000);
      }
      return () => {
        interval && clearInterval(interval);
      };
    }, []);
    return <div>Next visitor is waiting {seconds} seconds</div>;
  };

  const nameInputRef = useRef();

  const isQueueFull = waitingList?.length >= 20;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && centerId && !userAlreadyInQueue) {
      !isQueueFull && joinVisitorQueue(centerId, name);
    }
  };

  const positionInQueue =
    waitingList && waitingList.findIndex((user) => user?.uid === uid) + 1;

  return (
    <>
      {!isOwner && (
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
                userAlreadyInQueue || !isVisitorCenterOpen || isQueueFull
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
                  userAlreadyInQueue || !isVisitorCenterOpen || isQueueFull
                }
              >
                Join queue
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDeleteUser(uid)}
                disabled={!userAlreadyInQueue}
              >
                Leave
              </Button>
            </Box>
            {userAlreadyInQueue && (
              <Typography>Position #{positionInQueue}</Typography>
            )}
          </form>
        </Paper>
      )}

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Waiting list (Max 20)</Typography>
        {isOwner && (
          <>
            <NextVisitorTimer />

            <Button
              className={classes.buttonMarginRight}
              size="small"
              variant="outlined"
              disabled={waitingList?.length <= 0}
              onClick={() => {
                handleClearWaitingList();
              }}
            >
              Clear all
            </Button>
            <Button
              variant="contained"
              color={isVisitorCenterOpen ? "secondary" : "primary"}
              size="small"
              onClick={() => toggleGates()}
            >
              {gatesOpen ? "Close gates" : "Open gates"}
            </Button>
          </>
        )}
        {!waitingList ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {waitingList?.length > 0 ? (
              <List dense>
                {waitingList.map(({ name, joinedAt, uid: userId }, index) => {
                  const date = moment(joinedAt.toDate()).calendar();
                  return (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        {index === 0 ? <FlightTakeoff /> : <PersonIcon />}
                      </ListItemAvatar>
                      <ListItemText
                        primary={`#${index + 1} ${name}`}
                        secondary={`Joined: ${date}`}
                      />

                      {index === 0 ? (
                        <Chip color="primary" label="Next" />
                      ) : (
                        <Chip label="Please wait..." />
                      )}
                      {isOwner && index === 0 && (
                        <Box ml={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeleteUser(userId)}
                          >
                            Done
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography>Visitor center is empty</Typography>
            )}
          </>
        )}
      </Paper>
    </>
  );
};

export default WaitingList;
