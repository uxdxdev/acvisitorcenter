import React, { useRef } from "react";
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
const WaitiingList = (props) => {
  const { id: centerId } = useParams();
  const {
    deleteUser,
    isOwner,
    joinVisitorQueue,
    isVisitorCenterOpen,
    userAlreadyInQueue,
  } = useWaitingList(centerId);
  const { waitingList } = props;
  const classes = useStyles();

  const nameInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    console.log(nameInputRef);
    nameInputRef.current.value = "";

    if (name && centerId && !userAlreadyInQueue) {
      joinVisitorQueue(centerId, name);
    }
  };

  return (
    <>
      <Paper className={classes.paper}>
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
            disabled={isOwner || userAlreadyInQueue}
          />
          <br />

          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            disabled={isOwner || userAlreadyInQueue || !isVisitorCenterOpen}
          >
            Join queue
          </Button>
          {(isOwner || userAlreadyInQueue) && (
            <Typography>You are already in the queue</Typography>
          )}
        </form>
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant="h2">Waiting list</Typography>

        {!waitingList ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {waitingList?.length > 0 ? (
              <>
                <Typography>
                  You can get the code when you are next in the queue
                </Typography>
                <List dense>
                  {waitingList.map(({ name, joinedAt, uid: userId }, index) => {
                    const date = moment(joinedAt.toDate()).calendar();
                    return (
                      <ListItem key={userId}>
                        <ListItemAvatar>
                          {index === 0 ? <FlightTakeoff /> : <PersonIcon />}
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${name}`}
                          secondary={`Joined: ${date}`}
                        />

                        {isOwner && index === 0 && (
                          <>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => deleteUser(centerId, userId)}
                            >
                              Done
                            </Button>
                          </>
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </>
            ) : (
              <Typography>Visitor center is empty</Typography>
            )}
          </>
        )}
      </Paper>
    </>
  );
};

export default WaitiingList;
