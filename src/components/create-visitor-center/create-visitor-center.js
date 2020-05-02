import React, { useState } from "react";
import { useCreateVisitorCenter } from "./hooks";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Paper, TextField, Button, Box } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { PageLoadingSpinner } from "../page-loading-spinner";
import { firebase } from "../../utils/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const CreateVisitorCenter = () => {
  const {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
    isCreatingVisitorCenterPending,
  } = useCreateVisitorCenter();

  const classes = useStyles();
  const [formInput, setFormInput] = useState({
    name: "",
    summary: "",
    code: "",
  });

  const onChange = (id, value) => {
    setFormInput((current) => {
      return {
        ...current,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleCreateVisitorCenter(
      formInput?.name,
      formInput?.summary,
      formInput?.code
    );
  };

  const url = visitorCenterData && `/center/${visitorCenterData?.owner}`;

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      {isLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          {visitorCenterData ? (
            <Box>
              <Typography variant="h2">{visitorCenterData?.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<SendIcon />}
                component={RouterLink}
                to={url}
                onClick={() => {
                  firebase.analytics().logEvent("go_to_your_visitor_center");
                }}
              >
                Go to your visitor center
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h2">Create visitor center</Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  id="name"
                  label="Name"
                  required
                  type="text"
                  onChange={(event) => {
                    const id = event?.target?.id;
                    const value = event?.target?.value;
                    onChange(id, value);
                  }}
                  value={formInput?.name}
                  inputProps={{ maxLength: "30" }}
                  variant="outlined"
                  margin="dense"
                />
                <br />

                <TextField
                  id="summary"
                  label="Summary"
                  required
                  type="text"
                  onChange={(event) => {
                    const id = event?.target?.id;
                    const value = event?.target?.value;
                    onChange(id, value);
                  }}
                  value={formInput?.summary}
                  fullWidth
                  inputProps={{ maxLength: "1000" }}
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={8}
                />

                <TextField
                  id="code"
                  label="Code"
                  type="text"
                  onChange={(event) => {
                    const id = event?.target?.id;
                    const value = event?.target?.value;
                    onChange(id, value.toUpperCase());
                  }}
                  value={formInput?.code}
                  inputProps={{
                    maxLength: "5",
                    minLength: "5",
                    "text-transform": "uppercase",
                  }}
                  variant="outlined"
                  margin="dense"
                />

                <Box mt={1}>
                  <Button
                    type="submit"
                    disabled={isCreatingVisitorCenterPending}
                    variant="contained"
                    color="primary"
                  >
                    Create visitor center
                  </Button>
                </Box>
              </form>
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default CreateVisitorCenter;
