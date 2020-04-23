import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQueue } from "./hooks";
import moment from "moment";

const Queue = () => {
  const { id: queueId } = useParams();
  const { uid, queueData, isJoiningQueue, joinQueue, deleteUser } = useQueue(
    queueId
  );
  let nameRef = useRef();
  const isOwner = queueData?.owner && queueData?.owner === uid;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameRef.current.value = "";
    const userExists =
      queueData?.waiting.filter((user) => user.uid === uid)?.length > 0;
    if (name && uid && !userExists) {
      joinQueue(queueId, { name, uid });
    } else {
      // console.error("invalid data or user already exists in queue");
    }
  };

  return (
    <>
      <h2>Name</h2>
      <div>{queueData?.name || "Loading..."}</div>
      <h2>Summary</h2>
      <div>{queueData?.summary || "Loading..."}</div>
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
        {isJoiningQueue ? (
          <div>Loading...</div>
        ) : (
          <div>
            <button type="submit">Join queue</button>
          </div>
        )}
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
                    {isOwner && (
                      <button onClick={() => deleteUser(queueId, uid)}>
                        Delete
                      </button>
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
