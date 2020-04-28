import React from "react";
import { useLatestVisitorCenterList } from "./hooks";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemAvatar,
} from "@material-ui/core";
import { Send as SendIcon, BeachAccess } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const LatestVisitorCenterList = () => {
  const { latestCenters, isLoading } = useLatestVisitorCenterList();
  const classes = useStyles();

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Typography variant="h2">Latest visitor centers</Typography>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {latestCenters?.length > 0 ? (
            <List dense>
              {latestCenters?.map((center) => {
                const id = center?.owner;
                const url = `/center/${id}`;
                const name = center?.name;
                const date = moment(center?.createdAt?.toDate()).calendar();

                return (
                  <ListItem key={id}>
                    <ListItemAvatar>
                      <BeachAccess />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${name}`}
                      secondary={`Created: ${date}`}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.button}
                      endIcon={<SendIcon />}
                      component={RouterLink}
                      to={url}
                    >
                      Visit
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography>There are no visitor centers</Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default LatestVisitorCenterList;
