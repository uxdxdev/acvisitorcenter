import React, { useRef } from "react";
import { useCreateVisitorCenter } from "./hooks";
import { Link as RouterLink } from "react-router-dom";
import { Link, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const CreateVisitorCenter = () => {
  const {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
  } = useCreateVisitorCenter();

  const classes = useStyles();

  let nameRef = useRef();
  let summaryRef = useRef();
  let codeRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    let summary = event.target.summary.value;
    let code = event.target.code.value;

    nameRef.current.value = "";
    summaryRef.current.value = "";
    codeRef.current.value = "";

    handleCreateVisitorCenter(name, summary, code);
  };

  const url = visitorCenterData && `/center/${visitorCenterData?.owner}`;

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Create visitor center</Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {visitorCenterData ? (
            <Link component={RouterLink} to={url}>
              Go to your visitor center
            </Link>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  id="name"
                  required
                  ref={nameRef}
                  maxLength="30"
                />
              </div>

              <div>
                <label htmlFor="code">Dodo code</label>
                <br />
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  ref={codeRef}
                  maxLength="5"
                  minLength="5"
                />
              </div>

              <div>
                <label htmlFor="summary">Summary</label>
                <br />
                <textarea
                  id="summary"
                  name="summary"
                  required
                  ref={summaryRef}
                  rows="5"
                  maxLength="1000"
                />
              </div>
              <div>
                <button type="submit" disabled={isLoading}>
                  Create visitor center
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </Paper>
  );
};

export default CreateVisitorCenter;
