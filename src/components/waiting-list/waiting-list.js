import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useWaitingList } from "./hooks";
import moment from "moment";
import { useUser } from "../../hooks";

const WaitiingList = () => {
  const { id: centerId } = useParams();
  const { uid } = useUser();
  const {
    waitingList,
    deleteUser,
    isOwner,
    joinVisitorQueue,
    isJoiningQueue,
  } = useWaitingList(centerId);

  const nameInputRef = useRef();
  const userPositionInQueue =
    waitingList && waitingList.filter((user) => user.uid === uid);

  const userAlreadyInQueue =
    userPositionInQueue === undefined || userPositionInQueue?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && uid && userPositionInQueue) {
      joinVisitorQueue(centerId, { name, uid });
    }
  };

  return (
    <>
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
      <h2>Waiting list</h2>
      {!waitingList ? (
        <div>Loading...</div>
      ) : (
        <>
          {waitingList?.length > 0 ? (
            <>
              <div>You can get the code when you are next in the queue</div>
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
            </>
          ) : (
            <div>Visitor center is empty</div>
          )}
        </>
      )}
    </>
  );
};

export default WaitiingList;
