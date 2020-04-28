import React from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenterInformation } from "./hooks";
import { VisitorCenterStatus } from "../visitor-center-status";
import { WaitingList } from "../../components/waiting-list";
import { Link } from "react-router-dom";

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
    isLoading,
    waitingList,
    isVisitorCenterOpen,
  } = useVisitorCenterInformation(centerId);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Link to={`/`}>
        <h1>AC Visitor Center</h1>
      </Link>

      <VisitorCenterStatus />

      <h2>Name</h2>
      {isEditable["name"] ? (
        <input
          type="text"
          value={centerInformation.name}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="name"
          maxLength="30"
          disabled={!isEditable["name"]}
        />
      ) : (
        <div>{centerInformation.name}</div>
      )}
      {isOwner && (
        <button onClick={() => handleUpdateCenterInformation("name")}>
          {isEditable["name"] ? "Save" : "Edit"}
        </button>
      )}

      <h2>Summary</h2>
      {isEditable["summary"] ? (
        <input
          type="text"
          value={centerInformation.summary}
          onChange={(event) => handleCenterInformationChange(event.target)}
          id="summary"
          name="summary"
          disabled={!isEditable["summary"]}
          maxLength="1000"
        />
      ) : (
        <div>{centerInformation.summary}</div>
      )}
      {isOwner && (
        <button onClick={() => handleUpdateCenterInformation("summary")}>
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
                  value={latestDodoCode.dodoCode}
                  onChange={(event) => handleDodoCodeChange(event.target)}
                  id="dodoCode"
                  disabled={!isEditable["dodoCode"]}
                  minLength="5"
                  maxLength="5"
                />
              ) : (
                <div>{latestDodoCode.dodoCode} </div>
              )}
              {isOwner && (
                <button
                  onClick={() => handleUpdateCenterInformation("dodoCode")}
                >
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
