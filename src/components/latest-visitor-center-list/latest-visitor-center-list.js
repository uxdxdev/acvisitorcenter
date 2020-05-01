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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import moment from "moment";
import { PageLoadingSpinner } from "../page-loading-spinner";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  chipGreen: {
    backgroundColor: theme.palette.success.main,
  },
  chipRed: {
    backgroundColor: theme.palette.error.main,
  },
}));

const LatestVisitorCenterList = () => {
  const { latestCenters, isLoading } = useLatestVisitorCenterList();
  const classes = useStyles();

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      {isLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <Typography variant="h2">
            Visitor centers{" "}
            <span role="img" aria-label="plane island">
              ✈️
            </span>
          </Typography>

          {latestCenters?.length > 0 ? (
            <List dense>
              {latestCenters?.map((center) => {
                const id = center?.owner;
                const url = `/center/${id}`;
                const name = center?.name;
                // const date = moment(center?.createdAt?.toDate()).calendar();

                return (
                  <ListItem key={id} dense disableGutters>
                    <ListItemText primary={`${name}`} />

                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
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
