import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useVisitorCenter } from "./hooks";
import moment from "moment";
import { useUser } from "../../hooks";

const Center = () => {
  const { id: centerId } = useParams();
  const {
    centerData,
    isJoiningCenter,
    joinCenter,
    deleteUser,
    dodoCode,
    isOwner,
    fetchDodoCode,
  } = useVisitorCenter(centerId);
  const { uid } = useUser();

  let nameRef = useRef();
  const userExistsInCenter =
    centerData?.waiting.filter((user) => user.uid === uid)?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameRef.current.value = "";

    if (name && uid && !userExistsInCenter) {
      joinCenter(centerId, { name, uid });
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
      <h2>Name</h2>
      <div>{centerData?.name || "Loading..."}</div>
      <h2>Summary</h2>
      <div>{centerData?.summary || "Loading..."}</div>
      <h2>Code</h2>
      <span>You can get the code when you are next in the center</span>
      <div>{dodoCode || "*******"}</div>
      <button onClick={() => fetchDodoCode()} disabled={dodoCode}>
        Get code
      </button>
      {!isOwner && (
        <>
          <h2>Join center</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                ref={nameRef}
                maxLength="20"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isJoiningCenter || userExistsInCenter}
              >
                Join center
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

export default Center;
