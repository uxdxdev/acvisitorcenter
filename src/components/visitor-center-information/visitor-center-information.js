import React from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenterInformation } from "./hooks";

const VisitorCenterInformation = () => {
  const { id: centerId } = useParams();
  const {
    isOwner,
    handleFetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleDodoCodeChange,
    handleUpdateCenterInformation,
    centerInformation,
    latestDodoCode,
    isUserFirstInQueue,
    isVisitorCenterOpen,
  } = useVisitorCenterInformation(centerId);

  return (
    <>
      {isOwner && (
        <span>
          Please keep this page open to manage the center. Closing this page
          will disable the center.
        </span>
      )}

      {isOwner && (
        <div>
          <button onClick={() => handleUpdateCenterInformation()}>
            {isEditable ? "Save" : "Edit information"}
          </button>
        </div>
      )}

      <h2>{isVisitorCenterOpen ? "Open" : "Closed"}</h2>

      <h2>Name</h2>
      {isEditable ? (
        <input
          type="text"
          value={centerInformation.name}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="name"
          maxLength="30"
          disabled={!isEditable}
        />
      ) : (
        <div>{centerInformation.name}</div>
      )}

      <h2>Summary</h2>
      {isEditable ? (
        <input
          type="text"
          value={centerInformation.summary}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="summary"
          name="summary"
          disabled={!isEditable}
          maxLength="1000"
        />
      ) : (
        <div>{centerInformation.summary}</div>
      )}
      {(isOwner || isUserFirstInQueue) && (
        <>
          <h2>Code</h2>
          {isEditable ? (
            <input
              type="text"
              value={latestDodoCode.dodoCode}
              onChange={(event) => handleDodoCodeChange(event.target)}
              id="dodoCode"
              disabled={!isEditable}
              minLength="5"
              maxLength="5"
            />
          ) : (
            <>
              <div>{latestDodoCode.dodoCode} </div>
            </>
          )}
          <button onClick={() => handleFetchDodoCode()} disabled={isEditable}>
            Get code
          </button>
        </>
      )}
    </>
  );
};

export default VisitorCenterInformation;
