import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenter } from "./hooks";
import moment from "moment";
import { useUser } from "../../hooks";

const VisitorCenter = () => {
  const { id: centerId } = useParams();
  const {
    centerData,
    isJoiningQueue,
    joinVisitorQueue,
    deleteUser,
    dodoCode,
    isOwner,
    fetchDodoCode,
    saveCenterData,
    updateDodoCode,
  } = useVisitorCenter(centerId);
  const { uid } = useUser();
  const [isEditable, setIsEditable] = useState(false);

  const nameInputRef = useRef();
  const userExistsInCenter =
    centerData?.waiting.filter((user) => user.uid === uid)?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && uid && !userExistsInCenter) {
      joinVisitorQueue(centerId, { name, uid });
    }
  };

  const [centerInformation, setCenterInformation] = useState({
    name: "Loading...",
    summary: "Loading...",
  });

  useEffect(() => {
    centerData && setCenterInformation(centerData);
  }, [centerData]);

  const handleCenterInformationChange = ({ id, value }) => {
    setCenterInformation((currentState) => {
      return { ...currentState, ...{ [id]: value } };
    });
  };

  const [latestDodoCode, setDodoCode] = useState({ dodoCode: "*****" });

  useEffect(() => {
    dodoCode && setDodoCode({ dodoCode });
  }, [dodoCode]);

  const handleDodoCodeChange = ({ id, value }) => {
    setDodoCode({ [id]: value });
  };

  const updateCenterInformation = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      saveCenterData(centerId, centerInformation);
      updateDodoCode(uid, latestDodoCode?.dodoCode);
    }
  };

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
          name="name"
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
        />
      ) : (
        <div>{centerInformation.summary}</div>
      )}

      <h2>Code</h2>
      {isEditable ? (
        <input
          type="text"
          value={latestDodoCode.dodoCode}
          onChange={(event) => handleDodoCodeChange(event.target)}
          id="dodoCode"
          name="dodoCode"
          disabled={!isEditable}
          minLength="5"
          maxLength="5"
        />
      ) : (
        <>
          <div>{latestDodoCode.dodoCode}</div>
        </>
      )}
      <button onClick={() => fetchDodoCode()} disabled={isEditable}>
        Get code
      </button>

      {!isOwner && (
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
                maxLength="20"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isJoiningQueue || userExistsInCenter}
              >
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
      {!centerData?.waiting ? (
        <div>Loading...</div>
      ) : (
        <>
          {centerData?.waiting?.length > 0 ? (
            <ol>
              {centerData?.waiting.map(({ name, joinedAt, uid }, index) => {
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
