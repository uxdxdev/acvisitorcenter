import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenter } from "./hooks";
import moment from "moment";
import { useUser } from "../../hooks";

const VisitorCenter = () => {
  const { id: centerId } = useParams();
  const {
    waitingList,
    isJoiningQueue,
    joinVisitorQueue,
    deleteUser,
    isOwner,
    fetchDodoCode,
    isEditable,
    handleCenterInformationChange,
    handleDodoCodeChange,
    updateCenterInformation,
    centerInformation,
    latestDodoCode,
    isFetchingCenterDataError,
  } = useVisitorCenter(centerId);
  const { uid } = useUser();

  const nameInputRef = useRef();
  const userPositionInQueue =
    waitingList && waitingList.filter((user) => user.uid === uid);

  const userAlreadyInQueue =
    userPositionInQueue === undefined || userPositionInQueue?.length > 0;

  const isUserFirstInQueue = waitingList && waitingList[0]?.uid === uid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && uid && userPositionInQueue) {
      joinVisitorQueue(centerId, { name, uid });
    }
  };

  if (isFetchingCenterDataError) {
    return <div>Loading...</div>;
  }

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
          <button onClick={() => updateCenterInformation()}>
            {isEditable ? "Save" : "Edit information"}
          </button>
        </div>
      )}

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
          <div>You can get the code when you are next in the queue</div>

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
          <button onClick={() => fetchDodoCode(uid)} disabled={isEditable}>
            Get code
          </button>
        </>
      )}

      {!isOwner && !userAlreadyInQueue && (
        <>
          <h2>Join visitor queue</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                ref={nameInputRef}
                maxLength="30"
              />
            </div>
            <div>
              <button type="submit" disabled={isJoiningQueue}>
                Join queue
              </button>
            </div>
          </form>
        </>
      )}
      <h2>Waiting</h2>
      <span>
        When a visitor has departed click the "Done" button to allow the next
        visitor to travel.
      </span>
      {!waitingList ? (
        <div>Loading...</div>
      ) : (
        <>
          {waitingList?.length > 0 ? (
            <ol>
              {waitingList.map(({ name, joinedAt, uid }, index) => {
                const date = moment(joinedAt.toDate()).calendar();
                return (
                  <li key={index}>
                    {name} {date}{" "}
                    {isOwner && index === 0 && (
                      <>
                        <button onClick={() => deleteUser(centerId, uid)}>
                          Done
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div>Center is empty</div>
          )}
        </>
      )}
    </>
  );
};

export default VisitorCenter;
