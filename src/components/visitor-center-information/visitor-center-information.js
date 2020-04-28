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

      <Typography variant="h2">Name</Typography>
      {isEditable["name"] ? (
        <input
          type="text"
          value={updatedVisitorCenterData.name}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="name"
          maxLength="30"
          disabled={!isEditable["name"]}
        />
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

      <Typography variant="h2">Summary</Typography>
      {isEditable["summary"] ? (
        <input
          type="text"
          value={updatedVisitorCenterData.summary}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="summary"
          name="summary"
          disabled={!isEditable["summary"]}
          maxLength="1000"
        />
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

      {(isOwner || isUserFirstInQueue) && (
        <>
          <Typography variant="h2">Code</Typography>
          {isVisitorCenterOpen ? (
            <>
              {isEditable["dodoCode"] ? (
                <input
                  type="text"
                  value={updatedVisitorCenterData.dodoCode}
                  onChange={(event) =>
                    handleCenterInformationChange(event.target)
                  }
                  id="dodoCode"
                  disabled={!isEditable["dodoCode"]}
                  minLength="5"
                  maxLength="5"
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
                >
                  Get code
                </Button>
              </ButtonBox>
            </>
          ) : (
            <Typography>The visitor center is closed</Typography>
          )}
        </>
      )}
      <WaitingList waitingList={waitingList} />
    </>
  );
};

export default VisitorCenterInformation;
