import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQueue } from "./hooks";
import moment from "moment";
import { useUser } from "../../hooks";

const Queue = () => {
  const { id: queueId } = useParams();
  const {
    queueData,
    isJoiningQueue,
    joinQueue,
    deleteUser,
    islandCode,
    isOwner,
    fetchIslandCode,
  } = useQueue(queueId);
  const { uid } = useUser();

  let nameRef = useRef();
  const userExistsInQueue =
    queueData?.waiting.filter((user) => user.uid === uid)?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameRef.current.value = "";

    if (name && uid && !userExistsInQueue) {
      joinQueue(queueId, { name, uid });
    }
  };

  return (
    <>
      <h2>Name</h2>
      <div>{queueData?.name || "Loading..."}</div>
      <h2>Summary</h2>
      <div>{queueData?.summary || "Loading..."}</div>
      <h2>Code</h2>
      <div style={{ textTransform: "uppercase" }}>{islandCode}</div>
      <button onClick={() => fetchIslandCode()}>Get code</button>
      <h2>Join queue</h2>
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
          <button type="submit" disabled={isJoiningQueue || userExistsInQueue}>
            Join queue
          </button>
        </div>
      </form>
      <h2>Waiting</h2>
      {!queueData?.waiting ? (
        <div>Loading...</div>
      ) : (
        <>
          {queueData?.waiting?.length > 0 ? (
            <ol>
              {queueData?.waiting.map(({ name, joinedAt, uid }, index) => {
                const date = moment(joinedAt.toDate()).calendar();
                return (
                  <li key={index}>
                    {name} {date}{" "}
                    {isOwner && index === 0 && (
                      <>
                        <button onClick={() => deleteUser(queueId, uid)}>
                          Done
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div>Waiting queue is empty</div>
          )}
        </>
      )}
    </>
  );
};

export default Queue;
