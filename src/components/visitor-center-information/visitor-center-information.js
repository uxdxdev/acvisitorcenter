import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenterInformation } from "./hooks";
import { VisitorCenterStatus } from "../visitor-center-status";
import { WaitingList } from "../../components/waiting-list";
import { Typography, Paper, TextField, Button } from "@material-ui/core";
import ButtonBox from "../../shared/ButtonBox";
import { makeStyles } from "@material-ui/core/styles";
import { AlertDialog } from "../alert-dialog";

const useStyles = makeStyles((theme) => ({
  buttonMarginRight: {
    marginRight: theme.spacing(1),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  summary: {
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
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
    isVisitorCenterOpen,
  } = useVisitorCenterInformation(centerId);
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    isUserFirstInQueue && handleOpen();
  }, [isUserFirstInQueue]);

  const isCodeAvailable =
    isOwner || (isUserFirstInQueue && isVisitorCenterOpen);

  return isLoading ? (
    <Typography>Loading...</Typography>
  ) : (
    <>
      <AlertDialog
        open={open}
        code={updatedVisitorCenterData.dodoCode}
        getCode={handleFetchDodoCode}
        handleClose={handleClose}
      />

      <VisitorCenterStatus />

      <Paper elevation={0} variant="outlined" className={classes.paper}>
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
          <Typography variant="h2">{updatedVisitorCenterData.name}</Typography>
        )}
        {isOwner && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditSaveData("name")}
          >
            {isEditable["name"] ? "Save" : "Edit name"}
          </Button>
        )}
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
          <Typography className={classes.summary}>
            {updatedVisitorCenterData.summary}
          </Typography>
        )}
        {isOwner && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditSaveData("summary")}
          >
            {isEditable["summary"] ? "Save" : "Edit summary"}
          </Button>
        )}
      </Paper>

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Code</Typography>

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
            disabled={!isCodeAvailable && !isUserFirstInQueue}
          >
            Get code
          </Button>
        </ButtonBox>
      </Paper>

      <WaitingList />
    </>
  );
};

export default VisitorCenterInformation;
