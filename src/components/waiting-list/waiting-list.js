import React from "react";
import { useParams } from "react-router-dom";
import { useWaitingList } from "./hooks";
import moment from "moment";
import {
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Chip,
} from "@material-ui/core";
import { Person as PersonIcon, FlightTakeoff } from "@material-ui/icons";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { NextVisitorTimer } from "../next-visitor-timer";
import { makeStyles } from "@material-ui/core/styles";
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

const WaitingList = () => {
  const { id: centerId } = useParams();
  const {
    handleDeleteUser,
    handleClearWaitingList,
    isOwner,
    isVisitorCenterOpen,
    waitingList,
    toggleGates,
    gatesOpen,
    isDeletingUser,
    isClearingWaitlist,
    isUpdatingVisitorGateStatus,
    centerLastActive,
  } = useWaitingList(centerId);
  const classes = useStyles();

  return (
    <>
      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="subtitle2">
          Last active {centerLastActive}
        </Typography>
        <Typography variant="h2">
          Waiting{" "}
          <span role="img" aria-label="list">
            📋
          </span>
        </Typography>

        {isOwner && (
          <>
            <NextVisitorTimer />

            <Button
              className={classes.buttonMarginRight}
              size="small"
              variant="outlined"
              disabled={waitingList?.length <= 0 || isClearingWaitlist}
              onClick={() => {
                firebase.analytics().logEvent("clear_waiting_list");
                handleClearWaitingList();
              }}
            >
              Clear all
            </Button>
            <Button
              variant="contained"
              color={isVisitorCenterOpen ? "secondary" : "primary"}
              size="small"
              onClick={() => {
                firebase.analytics().logEvent("toggle_gates");
                toggleGates();
              }}
              disabled={isUpdatingVisitorGateStatus}
            >
              {gatesOpen ? "Close gates" : "Open gates"}
            </Button>
          </>
        )}
        {!waitingList ? (
          <PageLoadingSpinner />
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
                            onClick={() => {
                              firebase.analytics().logEvent("remove_visitor");
                              handleDeleteUser(userId);
                            }}
                            disabled={isDeletingUser}
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
