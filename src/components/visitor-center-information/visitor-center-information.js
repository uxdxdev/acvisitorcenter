import React from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenterInformation } from "./hooks";
import { VisitorCenterStatus } from "../visitor-center-status";
import { WaitingList } from "../../components/waiting-list";
import { Typography, Paper, TextField, Button } from "@material-ui/core";
import ButtonBox from "../../shared/ButtonBox";
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

const VisitorCenterInformation = () => {
  const { id: centerId } = useParams();
  const {
    isOwner,
    handleFetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleEditSaveData,
    updatedVisitorCenterData,
    isUserFirstInQueue,
    isLoading,
    waitingList,
    isVisitorCenterOpen,
  } = useVisitorCenterInformation(centerId);
  const classes = useStyles();

  return isLoading ? (
    <Typography>Loading...</Typography>
  ) : (
    <>
      <VisitorCenterStatus />

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Name</Typography>
        {isEditable["name"] ? (
          <>
            <TextField
              type="text"
              value={updatedVisitorCenterData.name}
              onChange={(event) => {
                const id = event?.target?.id;
                const value = event?.target?.value;
                handleCenterInformationChange(id, value);
              }}
              id="name"
              label="Name"
              maxLength="30"
              disabled={!isEditable["name"]}
              inputProps={{ maxLength: "30" }}
              variant="outlined"
              margin="dense"
            />
            <br />
          </>
        ) : (
          <Typography>{updatedVisitorCenterData.name}</Typography>
        )}
        {isOwner && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEditSaveData("name")}
          >
            {isEditable["name"] ? "Save" : "Edit"}
          </Button>
        )}
      </Paper>

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Summary</Typography>
        {isEditable["summary"] ? (
          <>
            <TextField
              type="text"
              value={updatedVisitorCenterData.summary}
              onChange={(event) => {
                const id = event?.target?.id;
                const value = event?.target?.value;
                handleCenterInformationChange(id, value);
              }}
              id="summary"
              name="summary"
              label="Summary"
              disabled={!isEditable["summary"]}
              inputProps={{ maxLength: "1000" }}
              variant="outlined"
              fullWidth
              margin="dense"
              multiline
              rows={8}
            />
            <br />
          </>
        ) : (
          <Typography>{updatedVisitorCenterData.summary}</Typography>
        )}
        {isOwner && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEditSaveData("summary")}
          >
            {isEditable["summary"] ? "Save" : "Edit"}
          </Button>
        )}
      </Paper>

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Code</Typography>
        {isVisitorCenterOpen ? (
          <>
            {isEditable["dodoCode"] ? (
              <TextField
                type="text"
                value={updatedVisitorCenterData.dodoCode}
                onChange={(event) => {
                  const id = event?.target?.id;
                  const value = event?.target?.value;
                  handleCenterInformationChange(id, value.toUpperCase());
                }}
                id="dodoCode"
                label="Code"
                disabled={!isEditable["dodoCode"]}
                inputProps={{ maxLength: "5", minLength: "5" }}
                variant="outlined"
                margin="dense"
              />
            ) : (
              <Typography>{updatedVisitorCenterData.dodoCode}</Typography>
            )}
            <ButtonBox>
              {isOwner && (
                <Button
                  className={classes.buttonMarginRight}
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleEditSaveData("dodoCode")}
                >
                  {isEditable["dodoCode"] ? "Save" : "Edit"}
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleFetchDodoCode()}
                disabled={!isOwner && !isUserFirstInQueue}
              >
                Get code
              </Button>
            </ButtonBox>
          </>
        ) : (
          <Typography>The visitor center is closed</Typography>
        )}
      </Paper>

      <WaitingList waitingList={waitingList} />
    </>
  );
};

export default VisitorCenterInformation;
