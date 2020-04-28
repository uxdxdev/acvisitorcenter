import React from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenterInformation } from "./hooks";
import { VisitorCenterStatus } from "../visitor-center-status";
import { WaitingList } from "../../components/waiting-list";

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

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <VisitorCenterStatus />

      <h2>Name</h2>
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
        <div>{updatedVisitorCenterData.name}</div>
      )}
      {isOwner && (
        <button onClick={() => handleEditSaveData("name")}>
          {isEditable["name"] ? "Save" : "Edit"}
        </button>
      )}

      <h2>Summary</h2>
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
        <div>{updatedVisitorCenterData.summary}</div>
      )}
      {isOwner && (
        <button onClick={() => handleEditSaveData("summary")}>
          {isEditable["summary"] ? "Save" : "Edit"}
        </button>
      )}

      {(isOwner || isUserFirstInQueue) && (
        <>
          <h2>Code</h2>
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
                <div>{updatedVisitorCenterData.dodoCode} </div>
              )}
              {isOwner && (
                <button onClick={() => handleEditSaveData("dodoCode")}>
                  {isEditable["dodoCode"] ? "Save" : "Edit"}
                </button>
              )}
              <button onClick={() => handleFetchDodoCode()}>Get code</button>
            </>
          ) : (
            <div>The visitor center is closed</div>
          )}
        </>
      )}
      <WaitingList waitingList={waitingList} />
    </>
  );
};

export default VisitorCenterInformation;
